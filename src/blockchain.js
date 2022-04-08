const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./block.js");
const hex2ascii = require("hex2ascii")
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
            let block = new BlockClass.Block({owner:"No certificates yet.",cert_name:"Genesis Block"});
            await this.__addBlock(block);
        }
    }
    getChainHeight(){
        return new Promise((resolve, reject)=>{
                resolve(this.height);
        });
    }
    getChainBlocks(){
        let self=this;
        return new Promise(async (resolve,reject) => {
            if(self.chain.length > 0)
            {
                resolve(self.chain)
            }
            else
            {
                reject('Chain is empty');
            }
        });
    }
    getAllCertificates(){
        let self=this;
        let certs = [];
        return new Promise(async (resolve,reject)=>{
            self.chain.forEach((b) => {
                let data=JSON.parse(hex2ascii(b.body));
                if(data) certs.push(data);
            });
            
            if(certs.length >0)
            {
                resolve(certs);
            }
            else{
                reject('No data found');
            }
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
    submitCertificate(owner,cert_name){
        let self=this;
        return new Promise(async (resolve,reject)=>{
            const _block=new BlockClass.Block({owner:owner,cert_name:cert_name});
            if(_block)
            {
                resolve(await self.__addBlock(_block));}
            else{
                reject("Can't add the required block");}
        });

    }
}
module.exports.Blockchain = Blockchain;