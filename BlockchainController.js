const path=require("path");
const express=require('express');
const router = express.Router();
class BlockchainController{
    constructor(app){
        this.app=app;
        this.helloWorld();
        this.app.use('/',router)
    }
    helloWorld(){
        router.get("/", function (req, res) {
                //res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                res.sendFile(path.join(__dirname, '/index.html'));
                //res.end();
            });
    }
}

module.exports = (app)=> {
    return new BlockchainController(app);
};
