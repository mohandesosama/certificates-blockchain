const express = require("express");
const path= require('path');
//const morgan = require("morgan");
const body_parser=require('body-parser');
//this multer is really important for parsing from forms
//it will not work if you deleted the next 2 lines
var multer = require('multer');
var upload = multer();
const BlockChain = require('./src/blockchain.js');

//var multer = require('multer');
//var upload = multer();
class ApplicationServer{
    constructor(){
        this.app=express();
        this.blockchain= new BlockChain.Blockchain();
        this.initExpress();
        this.initExpressMiddleWare();
        this.initControllers();
        this.start();
    }
    initExpress(){
        //this.app.use( '/www', express.static( path.resolve( __dirname, 'www' ) ) );
        this.app.set("port", process.env.PORT || 8000);
    }
    initExpressMiddleWare(){
        //this.app.use(morgan("dev"));
        // for parsing application/json
        this.app.use(body_parser.json()); 
        // for parsing application/xwww-
        this.app.use(body_parser.urlencoded({ extended: true })); 
        //multiple forms on the same page. 
        this.app.use(upload.array()); 
        //for pug usage, pointing the templates folder
        this.app.set('views', __dirname + '/views');
        this.app.set('view engine', 'pug');
        //set static folder
        this.app.use(express.static(path.join(__dirname,'public')));
    }
    initControllers()
    {
        require("./BlockchainController.js")(this.app, this.blockchain);
    }
    start()
    {
        let self=this;
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server listining port : ${self.app.get("port")}`);
        });
    }
}
new ApplicationServer();