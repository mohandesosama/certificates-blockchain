const path=require("path")
class BlockchainController{
    constructor(app){
        this.app=app;
        this.helloWorld();
    }
    helloWorld(){
        this.app.get("/", function (req, res) {
                res.sendFile(path.resolve( __dirname, 'www/index.html' ));
                res.end();
            });
    }
}

module.exports = (app)=> {
    return new BlockchainController(app);
};
