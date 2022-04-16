//for creating public address
// I converted the type script here https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
// using type script to javascript converter https://extendsclass.com/typescript-to-javascript.html 
var ecpair_1 = require("ecpair");
var ecc = require("tiny-secp256k1");
var ECPair = (0, ecpair_1.default)(ecc);
var bitcoin = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
var Cryo = require('cryo');

class Wallet{
    constructor(){
        this.keyPair = ECPair.makeRandom();
        this.__extractKeysFromKeypair();
    }
    __extractKeysFromKeypair()
    {
        // try serilizing keyPair object from here https://www.toptal.com/javascript/serializing-complex-objects-in-javascript
        const { address } = bitcoin.payments.p2pkh({ pubkey: this.keyPair.publicKey });
        const publicKey = this.keyPair.publicKey.toString('hex');
        const privateKey = this.keyPair.toWIF();
        this.privateKeyObj=this.keyPair.privateKey
        //console.log('key pair'+keyPair.compressed)
        this.keys={'address':address,'publicKey':publicKey,'privateKey':privateKey}
    }
    //best place for serialze and deserialize
    //https://localcoder.org/best-way-to-serialize-unserialize-objects-in-javascript
    getSerializedKeyPair()
    {
        console.log('serialized keypair '+ Cryo.stringify(this.keyPair))
        return Cryo.stringify(this.keyPair)
    }
    setKeyPair(serialized_keypair)
    {
        console.log(serialized_keypair)
        this.keyPair=Cryo.parse(serialized_keypair);
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

