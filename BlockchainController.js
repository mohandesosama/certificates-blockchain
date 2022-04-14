//const path=require("path");
const SHA256 = require("crypto-js/sha256");
const passport=require('passport');
const wallet= require('./src/wallet.js');
const fs = require('fs');
const QRCode = require('qrcode');
class BlockchainController{
    constructor(app,db, bchainObj){
        this.app=app;
        this.db = db;
        this.blockchain=bchainObj;
        this.wallet=new wallet.Wallet();
        //this.Wallet=new
        //create the tables 
        //this.createDBTables();
        //GET forms here
        this.allRoutes();
        this.homePage();
        this.blockChainPage();
        this.addBlockPage();
        this.registerUserPage();
        this.userLoginPage();
        this.displayUserPage();
        
        
        //POST forms here
        this.addBlock();
        this.addUser();
        this.userLogin();
        this.userLogout();
        
    }
    allRoutes(){
        this.app.get('*',function(req,res,next){
            //console.log('user ' + JSON.stringify(req.user));
            res.locals.user=req.user || null;
            next();
        });
    }
    homePage(){
        let self=this;
        this.app.get("/", async (req, res) => {
                //res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                //let certs= await self.blockchain.getAllCertificates();
                //let json_chain=JSON.stringify(fchain);
                //res.render('index', {certs:certs});
                res.render('index',  {express_flash: req.flash('success') });
                //res.end();
            });
    }
    blockChainPage(){
        let self=this;
        this.app.get("/blockchain", async (req, res) => {
                //res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                //let certs= await self.blockchain.getAllCertificates();
                let blocks= await self.blockchain.getChainBlocks();
                //let json_chain=JSON.stringify(fchain);
                res.render('blockchain', {blocks:blocks});
                //res.end();
            });
    }

    //Adding block
    addBlockPage(){
        this.app.get("/add", async (req, res) => {
                //res.sendFile(path.join(__dirname,'/public/addBlock.html'));
                res.render('add_certificate');
        });
    }
    addBlock(){
        let self=this;
        this.app.post("/add", async (req,res) => {
                var cert_owner=req.body.cert_owner;
                var cert_name=req.body.cert_name;
                //var val="New Block has been added into the blockchain= "+req.body.block_data;
                //res.send(req.body.block_data)
                //return console.log(req.body.block_data);
                
                let block= await self.blockchain.submitCertificate(cert_owner,cert_name);
                if(block){
                    req.flash('success', 'Certificate Added');
                    res.redirect('/');
                }
                else
                {
                    return res.status(500).send("An error occured, block not added")
                }
            
          
        });
    }

    //register users
    registerUserPage(){
        this.app.get("/register", async (req, res) => {
                res.render('register');
        });
    }
    addUser(){
        let self=this;
        this.app.post("/register", async (req,res) => {
                var name=req.body.name;
                var email=req.body.email;
                var username=req.body.username;
                var password=req.body.password;
                self.db.serialize(()=>{
                    //every time you add new user, create new keypair
                    var serialized_keypair=self.wallet.getSerializedKeyPair();
                    //console.log('keypair saved into db' + JSON.stringify(keys));
                    self.db.run('INSERT INTO user(serialized_keypair, name,email,username,password) VALUES(?,?,?,?,?)', [serialized_keypair, name, email,username, SHA256(password)], function(err) {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).send("An error occured, user not registered")
                    }
                    req.flash('success', 'User Added');
                    res.redirect('/login');                    });
                });
                
         //   }
          
        });
    }
    userLoginPage(){
        this.app.get("/login", async (req, res) => {
            res.render('login');
    });
    }

    userLogin()
    {
        this.app.post('/login', function(req,res,next){
           // generate the authenticate method and pass the req/res
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                req.flash('error', "Errors in login " + err.toString())
                return next(err); 
            }
            if (!user) { 
                req.flash('error', "Invalid user, please try again")
                return res.redirect('/login'); }

            // req / res held in closure
            req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('success',"You successfully logged in")
            return res.redirect('/')
            });

        })(req,res,next);
        });
        
    }
    userLogout()
    {
        this.app.get('/logout',function(req,res){
            req.logout();
            req.flash('success',"You are logged out");
            res.redirect('/login')
        })
    }
    //display user data
    displayUserPage()
    {
        this.app.get("/userpage", async (req, res) => {
            //use qr code
            var uname= res.locals.user.username
            var serialized_keypair=res.locals.user.serialized_keypair
     
            this.wallet.setKeyPair(serialized_keypair);
            var waddress=this.wallet.getWalletAddress();
            //it says the private key should be a buffer. 
            //this.wallet.signMessageUsingPrivateKey("any", keys['privateKey'])
            //console.log('user ' + res.locals.user.username)
            const src = 'images/qrcodes/'+ uname + '_qrcode.png';
            console.log(src)
            var exists = fs.existsSync(src);
            // make sure you don't create the file every time you run the program. 
            if (!exists) {
                const stream = fs.createWriteStream(src);
                const code = await QRCode.toFileStream(stream, waddress);
                //console.log('qrcode: '+code)
            }
            
            //const exists = await utils.fileExists(src);
            //if(!exists) {
              //  const stream = fs.createWriteStream(src);
               // const code = await QRCode.toFileStream(stream, qrCodeText);
           // }
            res.render('userpage',{qrcode_filename: uname + '_qrcode.png'});
    });
    }

}

module.exports = (app,db, bchainObj)=> {
    return new BlockchainController(app,db, bchainObj);
};
