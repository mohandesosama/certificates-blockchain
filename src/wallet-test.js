var ecpair_1 = require("ecpair");
var ecc = require("tiny-secp256k1");
var ECPair = (0, ecpair_1.default)(ecc);
var bitcoin = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
class Wallet{
    constructor(){
        this.createKeyPair()
    }
    createKeyPair()
    {
        var keyPair = ECPair.makeRandom();
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        const publicKey = keyPair.publicKey.toString('hex');
        const privateKey = keyPair.privateKey
        var message = 'This is an example of a signed message.'

        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)

    }
}
wallet=new Wallet();