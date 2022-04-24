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
        let self=this;
        return new Promise(async (resolve,reject)=>{
            // if not genesis block.
            let current_hash=self.hash;
            console.log('current hash: ' + current_hash)
            self.hash=null
            let calc_hash=SHA256(JSON.stringify(self)).toString();
            console.log("calc hash: " + calc_hash)
            self.hash=current_hash;
            if(calc_hash == current_hash)
            {
                resolve(true)
            }
            else{
                resolve(false)
            }   

        })
    }
}
module.exports.Block= Block;