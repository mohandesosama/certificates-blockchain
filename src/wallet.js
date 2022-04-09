//for creating public address
// I converted the type script here https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
// using type script to javascript converter https://extendsclass.com/typescript-to-javascript.html 
var ecpair_1 = require("ecpair");
var ecc = require("tiny-secp256k1");
var ECPair = (0, ecpair_1.default)(ecc);
var bitcoin = require('bitcoinjs-lib');
class Wallet{
    constructor(){
    }
    generateNewKeyPairs(){
        /*It can generate a random address [and support the retrieval of transactions for that address (via 3PBP)*/
        const keyPair = ECPair.makeRandom();
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        this.address = address;
        this.publicKey = keyPair.publicKey.toString('hex');
        this.privateKey = keyPair.toWIF();
        }
    getWalletAddress(){
        return this.address;
    }
    getPublicKey(){
        return this.publicKey;
    }
    getPrivateKey(){
        return this.privateKey;
    }
}
module.exports.Wallet= Wallet;

