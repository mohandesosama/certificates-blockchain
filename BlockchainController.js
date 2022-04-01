var express = require('express');
const path=require("path");
const body_parser=require('body-parser');
var multer = require('multer');
var upload = multer();
class BlockchainController{
    constructor(app){
        this.app=app;
        //GET forms here
        this.homePage();
        this.addBlockPage();

        // for parsing application/json
        this.app.use(body_parser.json()); 
        // for parsing application/xwww-
        this.app.use(body_parser.urlencoded({ extended: true })); 
        //form-urlencoded
        this.app.use(upload.array()); 

        //POST forms here
        this.addBlock();
    }
    homePage(){
        this.app.get("/", function (req, res) {
                //res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                res.sendFile(path.join(__dirname, '/index.html'));
                //res.end();
            });
    }
    addBlockPage(){
        this.app.get("/add", function(req, res){
                res.sendFile(path.join(__dirname,'/addBlock.html'));
        });
    }
    addBlock(){
        this.app.post("/add", function(req,res){
            
            //return console.log("New Block has been added into the blockchain= "+req.body.block);
            var val="New Block has been added into the blockchain= "+req.body.block;
            //.send(val);
            //return res.status(400).json({ added: true, val });
            res.send(val)
        });
    }
}

module.exports = (app)=> {
    return new BlockchainController(app);
};
