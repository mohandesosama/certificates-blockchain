const path=require("path");
class BlockchainController{
    constructor(app, bchainObj){
        this.app=app;
        this.blockchain=bchainObj;
        //GET forms here
        this.homePage();
        this.addBlockPage();
        
        //POST forms here
        this.addBlock();
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
    addBlockPage(){
        this.app.get("/add", async (req, res) => {
                //res.sendFile(path.join(__dirname,'/public/addBlock.html'));
                res.render('add_certificate', {title:"Add Certificate "});
        });
    }
    addBlock(){
        let self=this;
        this.app.post("/add", async (req,res) => {
            var owner=req.body.owner;
            var cert_name=req.body.cert_name;
            //var val="New Block has been added into the blockchain= "+req.body.block_data;
            //res.send(req.body.block_data)
            //return console.log(req.body.block_data);
            if(owner && cert_name)
            {
                let block= await self.blockchain.submitCertificate(owner,cert_name);
                if(block){
                    res.redirect('/');
                }
                else
                {
                    return res.status(500).send("An error occured, block not added")
                }
            }
            else
            {
                res.status(500).send("Check the body parameters !!")
            }
            //return console.log("New Block has been added into the blockchain= "+req.body.block);
            //var val="New Block has been added into the blockchain= "+req.body.block;
            //.send(val);
            //return res.status(400).json({ added: true, val });
            //res.send(val)
        });
    }
}

module.exports = (app, bchainObj)=> {
    return new BlockchainController(app, bchainObj);
};
