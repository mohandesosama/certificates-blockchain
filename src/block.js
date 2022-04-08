class Block{
    constructor(data){
        this.height = null;
        this.body = Buffer.from(JSON.stringify(data)).toString("hex");
        this.time = null;
        this.previousBlockHash = null;
        this.hash=null;
    }
}
module.exports.Block= Block;