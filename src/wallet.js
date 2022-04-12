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
        this.__extractKeysFromKeypair();
    }
    __extractKeysFromKeypair()
    {
        var keyPair = ECPair.makeRandom();
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        const publicKey = keyPair.publicKey.toString('hex');
        const privateKey = keyPair.toWIF();
        //console.log('key pair'+keyPair.compressed)
        this.keys={'address':address,'publicKey':publicKey,'privateKey':privateKey}
    }
    getKeys(){
        return this.keys;
    }
    setKeys(keys){
        this.keys=keys;
    }
    getWalletAddress(){
        return this.keys['address'];
    }
   
    signMessageUsingPrivateKey(message, private_key){
        //https://github.com/bitcoinjs/bitcoinjs-message
        var signature = bitcoinMessage.sign(message, private_key, true);
        console.log(signature.toString('base64'))
    }
}
module.exports.Wallet= Wallet;

