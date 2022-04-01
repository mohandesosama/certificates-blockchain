class BlockchainController{
    constructor(app){
        this.app=app;
        this.helloWorld();
    }
    helloWorld(){
        this.app.get("/", async function (req, res) {
                res.sendFile("index.html");
                res.end();
            });
    }
}
module.exports = (app)=> {
    return new BlockchainController(app);
};
