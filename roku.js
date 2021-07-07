const http = require('http');

class Roku {
    constructor(ip) {
        this.ip = ip;
    }

    send(endpoint) {
        const options = {
            host: this.ip,
            port: 8060,
            path: `/keypress/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength('{}', 'utf8'),
            },
        };

        return new Promise((resolve, reject) => {
            const req = http.request(options, (resp) => {
                resp.on('error', (err) => {
                    reject(err);
                });

                resp.on('data', () => {});

                resp.on('end', () => {
                    if (resp.statusCode === 200) {
                        resolve();
                    } else {
                        reject(resp.error);
                    }
                });
            });

            req.write('{}');
            req.end();
        });
    }
}

module.exports = Roku;
