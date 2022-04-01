const SHA256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii")
class Block{
    constructor(data){
        this.height = null;
        this.body = Buffer.from(JSON.stringify(data)).toString("hex");
        this.time = null;
        this.previousBlockHash = null;
        this.hash=null;
    }
    getBlockData()
    {
        let self=this;
        return new Promise((resolve,reject) => {
            if(!self.previousBlockHash) reject("Genesis Block");
            resolve(JSON.parse(hex2ascii(self.body)));
        });
    }
}
module.exports.Block= Block;