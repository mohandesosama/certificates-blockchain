//for creating public address
// I converted the type script here https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
// using type script to javascript converter https://extendsclass.com/typescript-to-javascript.html 
var ecpair_1 = require("ecpair");
var ecc = require("tiny-secp256k1");
var ECPair = (0, ecpair_1.default)(ecc);
var bitcoin = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');

class Wallet{
    constructor(){
        this.keyPair = ECPair.makeRandom();
        this.__extractKeysFromKeypair();
    }
    __extractKeysFromKeypair()
    {
        const { address } = bitcoin.payments.p2pkh({ pubkey: this.keyPair.publicKey });
        const publicKey = this.keyPair.publicKey.toString('hex');
        const privateKey = this.keyPair.toWIF();
        
        this.privateKeyObj=this.keyPair.privateKey
        //console.log('key pair'+keyPair.compressed)
        this.keys={'address':address,'publicKey':publicKey,'privateKey':privateKey}
    }
    getPrivateKeyWif()
    {
        return this.keys['privateKey']
    }
    setKeyPair(privatekey)
    {
        this.keyPair=ECPair.fromWIF(privatekey)
        this.__extractKeysFromKeypair();
    }
    getWalletAddress(){
        return this.keys['address'];
    }
   
    signMessageUsingPrivateKey(message){
        //https://github.com/bitcoinjs/bitcoinjs-message
        var signature = bitcoinMessage.sign(message, this.privateKeyObj, this.keyPair.compressed);
        console.log(signature.toString('base64'))
    }
}
module.exports.Wallet= Wallet;

