const express = require("express");
const path= require('path');
//const morgan = require("morgan");
const body_parser=require('body-parser');
//this multer is really important for parsing from forms
//it will not work if you deleted the next 2 lines
var multer = require('multer');
var upload = multer();
const BlockChain = require('./src/blockchain.js');
//databases 
var sqlite3=require('sqlite3').verbose();
var fs = require('fs');

// validation , from this youtube video https://youtu.be/rBzCvbA0Dls
const expressValidator = require('express-validator');
//const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//var multer = require('multer');
//var upload = multer();
class ApplicationServer{
    constructor(){
        this.app=express();
        this.blockchain= new BlockChain.Blockchain();
        //console.log(this.blockchain.chain)
        this.db=this.initDB();

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
        this.app.use(express.static(path.join(__dirname,'images')));
        //express session middle ware
        // Express Session Middleware
        this.app.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true
        }));
        
        // Express Messages Middleware
        this.app.use(require('connect-flash')());
        this.app.use(function (req, res, next) {
            res.locals.messages = require('express-messages')(req, res);
            next();
        });
        
        // Express Validator Middleware
        //error expressValidtor is not a function - resolved from here https://stackoverflow.com/questions/56733975/express-validator-error-expressvalidator-is-not-a-function
        this.app.use(expressValidator({
            errorFormatter: function (param, msg, value) {
            var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;
        
            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
            }
        }));
        require('./src/passport')(passport,this.db);
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.passport=passport;
    }

    initDB()
    {
        var dbFile = './databases/users.db';
        var dbExists = fs.existsSync(dbFile);
        // make sure you don't create the file every time you run the program. 
        if (!dbExists) {
            fs.openSync(dbFile, 'w');
        }

        var db = new sqlite3.Database(dbFile);

        if (!dbExists) {
            db.run('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT,wallet_address TEXT,name TEXT,email TEXT,username TEXT, password TEXT, password2 TEXT)');
            console.log('table created')
        }
        return db
    }
    initControllers()
    {
        //console.log(this.blockchain);
        require("./BlockchainController.js")(this.app,this.db, this.blockchain);
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