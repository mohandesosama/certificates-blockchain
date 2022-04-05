//const path=require("path");
const SHA256 = require("crypto-js/sha256");
const { join } = require("path");
class BlockchainController{
    constructor(app,db, bchainObj){
        this.app=app;
        this.db = db;
        this.blockchain=bchainObj;
        //create the tables 
        //this.createDBTables();
        //GET forms here
        this.homePage();
        this.addBlockPage();
        this.registerUserPage();
        this.userLoginPage()
        
        //POST forms here
        this.addBlock();
        this.addUser();
        this.userLogin();
    }
    homePage(){
        let self=this;
        this.app.get("/", async (req, res) => {
                //res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                let certs= await self.blockchain.getAllCertificates();
                //let json_chain=JSON.stringify(fchain);
                res.render('index', {certs:certs});
                //res.end();
            });
    }

    //Adding block
    addBlockPage(){
        this.app.get("/add", async (req, res) => {
                //res.sendFile(path.join(__dirname,'/public/addBlock.html'));
                res.render('add_certificate', {title:"Add Certificate "});
        });
    }
    addBlock(){
        let self=this;
        this.app.post("/add", async (req,res) => {
            req.checkBody('owner','Owner is required').notEmpty();
            req.checkBody('cert_name','Certificate name is required').notEmpty();

            let errors=req.validationErrors();

            if(errors){
                res.render('add_certificate', {title:"Add Certificate ",errors:errors});
            }
            else
            {
                var owner=req.body.owner;
                var cert_name=req.body.cert_name;
                //var val="New Block has been added into the blockchain= "+req.body.block_data;
                //res.send(req.body.block_data)
                //return console.log(req.body.block_data);
    
                let block= await self.blockchain.submitCertificate(owner,cert_name);
                if(block){
                    req.flash('success', 'Article Added');
                    res.redirect('/');
                }
                else
                {
                    return res.status(500).send("An error occured, block not added")
                }
            }
          
        });
    }

    //register users
    registerUserPage(){
        this.app.get("/register", async (req, res) => {
                res.render('register', {title:"User Registeration "});
        });
    }
    addUser(){
        let self=this;
        this.app.post("/register", async (req,res) => {
            req.checkBody('name','Name is required').notEmpty();
            req.checkBody('email','Email is not valid').isEmail();
            req.checkBody('username','User Name is required').notEmpty();
            req.checkBody('password','Password is required').notEmpty();
            req.checkBody('password2','Password don\'t match').equals(req.body.password);


            let errors=req.validationErrors();

            if(errors){
                res.render('register', {title:"User Registeration",errors:errors});
            }
            else
            {
                var name=req.body.name;
                var email=req.body.email;
                var username=req.body.username;
                var password=req.body.password;
                var password2=req.body.password2;
                
                self.db.serialize(()=>{
                    self.db.run('INSERT INTO user(name,email,username,password,password2) VALUES(?,?,?,?,?)', [name, email,username, SHA256(password), SHA256(password2)], function(err) {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).send("An error occured, user not registered")
                    }
                    req.flash('success', 'User Added');
                    res.redirect('/login');                    });
                });
                
            }
          
        });
    }
    userLoginPage(){
        this.app.get("/login", async (req, res) => {
            res.render('login', {title:"User Login "});
    });
    }
    userLogin(){
        let self=this;
        this.app.post("/login", async (req,res) => {
            req.checkBody('username','User Name is required').notEmpty();
            req.checkBody('password','Password is required').notEmpty();

            let errors=req.validationErrors();

            if(errors){
                res.render('login', {title:"User Login",errors:errors});
            }
            else
            {
                var username=req.body.username;
                var password=req.body.password;
                
                self.db.serialize(()=>{
                    self.db.get('select username, password from user where username=? and password=?', [username, SHA256(password)], function(err,row) {
                    if (err || !row) {
                        //console.log(err.message);
                        req.flash('info', 'Can\'t login, make sure you have an account');
                        res.redirect('/login'); 
                    }
                    else
                    {
                        req.flash('success', 'You logged in');
                        res.redirect('/'); 
                    }

                           
                    });
                });
                
            }
          
        });
    }
}

module.exports = (app,db, bchainObj)=> {
    return new BlockchainController(app,db, bchainObj);
};
