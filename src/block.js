const { SHA256 } = require("crypto-js");

class Block{
    constructor(data){
        this.height = null;
        this.body = Buffer.from(JSON.stringify(data)).toString("hex");
        this.time = null;
        this.previousBlockHash = null;
        this.hash=null;
    }
    validate()
    {
        self=this;
        return new Promise(async (resolve,reject)=>{
            let current_hash=self.hash;
            self.hash=null
            let calc_hash=SHA256(JSON.stringify(self)).toString();
            self.hash=current_hash;
            if(calc_hash == current_hash)
            {
                resolve(true)
            }
            reject(false)
        })
    }
}
module.exports.Block= Block;