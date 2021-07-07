const http = require('http');
const os = require('os');
const CIDR = require('./cidr_calc');

class NetworkScan {
    constructor() {
        const ifaces = os.networkInterfaces();
        this.cidrs = [];
        this.port = 8060;
        Object.entries(ifaces).forEach(([iface, addressList]) => {
            if (iface !== 'lo0') {
                addressList.forEach((addressDetails) => {
                    if (addressDetails.family === 'IPv4') {
                        const rangeDetails = addressDetails.cidr.split('/');

                        this.cidrs.push(rangeDetails);
                    }
                });
            }
        });
    }

    httpGET(ipAddr) {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: ipAddr,
                port: this.port,
                path: '/',
                method: 'GET',
                timeout: 2000,
            };

            const req = http.request(options, (resp) => {
                let body = '';
                resp.on('data', (rBytes) => {
                    body += rBytes.toString();
                });
                resp.on('end', () => {
                    if (body.toLowerCase().includes('roku')) {
                        let device = body.match(new RegExp(/\<friendlyName\>.*\<\/friendlyName\>/gm))[0];
                        if (device) {
                            resolve([ipAddr, device.slice(14, device.length - 15)]);
                        } else {
                            reject();
                        }
                    }
                });
            });

            req.on('error', () => {
                reject();
            });
            req.on('timeout', () => {
                reject();
            });
            req.on('socket', (s) => {
                s.setTimeout(1000, () => {
                    s.destroy();
                    reject();
                });
            });
            req.end();
        });
    }

    async scanNetworkRange() {
        let results = [];
        this.cidrs.forEach((cidrBlock) => {
            const networkRanges = new CIDR(cidrBlock[0], cidrBlock[1]).calculateNetwork();
            for (let index = 0; index < networkRanges.maxHosts; index++) {
                networkRanges.networkAddr++; // skip network addr
                const octets = [
                    ((networkRanges.networkAddr >> 24) & 0xFF).toString(10),
                    (((networkRanges.networkAddr & 0x00FF0000) >> 16) >>> 0).toString(10),
                    (((networkRanges.networkAddr & 0x0000FF00) >> 8) >>> 0).toString(10),
                    ((networkRanges.networkAddr & 0x000000FF) >>> 0).toString(10),
                ].join('.');
                results.push(this.httpGET(octets));
            }
        });
        let result = await Promise.allSettled(results);
        let rokus = {};
        result.forEach((res) => {
            if (res.status !== 'rejected') {
                let ip;
                let deviceName;
                [ip, deviceName] = res.value;
                rokus[ip] = deviceName;
            }
        });
        return rokus;
    }
}

module.exports = NetworkScan;
