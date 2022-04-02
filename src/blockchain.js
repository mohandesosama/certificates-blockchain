const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./block.js");
//const bitcoinMessage=require("bitcoinjs-message");
class Blockchain{
    constructor(){
        this.chain=[];
        this.height=-1;
        this.initializeChain();
    }
    async initializeChain(){
        if (this.height === -1)
        {
            let block = new BlockClass.Block({data:"Genesis Block"});
            await this.__addBlock(block);
        }
    }
    getChainHeight(){
        return new Promise((resolve, reject)=>{
                resolve(this.height);
        });
    }
    getFullChain(){
        let self=this;
        return new Promise((resolve,reject)=>
        {
            //if(self.chain.height > 0){
                resolve(self.chain);
            //} else{
             //   reject("empty chain");
           // }
        });
    }
    __addBlock(block){
        //self contains the current blockchain
        let self = this;
        return new Promise(async (resolve, reject) => {
            const _block=block;
            _block.previousBlockHash = self.chain[self.height]?.hash || null;
            _block.height = self.height + 1;
            _block.time = new Date().getTime().toString().slice(0,-3);
            _block.hash = SHA256(JSON.stringify(_block)).toString();
            if(self.chain.push(_block))
            {
                self.height = self.chain.length - 1;
                resolve(_block);
            }
            else{
                reject("Error, No block added")
            }
            
        });
       
    }
    submitCertificate(b_data){
        let self=this;
        return new Promise(async (resolve,reject)=>{
            const _block=new BlockClass.Block({data:{b_data},});
            if(_block)
            {
                resolve(await self.__addBlock(_block));}
            else{
                reject("Can't add the required block");}
        });

    }
}
module.exports.Blockchain = Blockchain;