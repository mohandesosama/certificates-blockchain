class BlockchainController{
    constructor(app){
        this.app=app;
        this.helloWorld();
    }
    helloWorld(){
        this.app.get("/", async (req,res) => {
                res.send("Hello World");
                res.end();
        });
    }
}
module.exports = (app)=> {
    return new BlockchainController(app);
};
