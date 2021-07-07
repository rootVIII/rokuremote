const { Buffer } = require('buffer');

class CIDR {
    constructor(ip, rangeBlock) {
        this.ip = ip;
        this.prefix = Buffer.alloc(1);
        this.prefix.writeUint8(rangeBlock, 0);
        this.networkAddress = Buffer.alloc(4);
        this.subnetMask = Buffer.alloc(4);
        this.hostsMax = 0;
        this.onBits = this.offBits = 0x00;
    }

    setSubnetMask() {
        const trailing = 0x20 - this.prefix.readUInt8();
        this.subnetMask.writeUInt32BE(((0xFFFFFFFF >> trailing) << trailing) >>> 0);
    }

    setMaxHosts() {
        this.hostsMax = 1 << this.offBits;
        if (this.prefix.readUInt8() !== 0x20) {
            this.hostsMax -= 2;
        }
    }

    setNeworkID() {
        const octets = this.ip.split('.');
        const ipAddrUint32 = Buffer.from([
            parseInt(octets[0], 10),
            parseInt(octets[1], 10),
            parseInt(octets[2], 10),
            parseInt(octets[3], 10),
        ]);

        const netAddr = (ipAddrUint32.readUInt32BE() & this.subnetMask.readUInt32BE()) >>> 0;
        this.networkAddress.writeUInt32BE(netAddr);
    }

    calculateNetwork() {
        this.setSubnetMask();
        this.onBits = Math.clz32(~this.subnetMask.readUInt32BE());
        this.offBits = 0x20 - this.onBits;
        this.setMaxHosts();
        this.setNeworkID();

        return {
            networkAddr: this.networkAddress.readUInt32BE(),
            maxHosts: this.hostsMax,
        };
    }
}

module.exports = CIDR;
