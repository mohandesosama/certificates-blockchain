class BlockchainController{
    constructor(app){
        this.app=app;
        this.helloWorld();
        this.app.use( '/www', express.static( path.resolve( __dirname, 'www' ) ) );
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
