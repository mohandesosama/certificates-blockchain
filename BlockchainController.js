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
        let self=this;
        this.app.post("/add", async (req,res) => {
            var data=req.body.block_data;
            //var val="New Block has been added into the blockchain= "+req.body.block_data;
            //res.send(req.body.block_data)
            //return console.log(req.body.block_data);
            if(data)
            {
                let block= await self.blockchain.submitCertificate(data);
                if(block){
                    return res.status(200).json(block);
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
