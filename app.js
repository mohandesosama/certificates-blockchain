const express = require("express");
const path=require("path")
class ApplicationServer{
    constructor(){
        this.app=express();
        this.initExpress();
        this.initControllers();
        this.start();
    }
    initExpress(){
        this.app.use( '/www', express.static( path.resolve( __dirname, 'www' ) ) );
        this.app.set("port", process.env.PORT || 8000);
    }
    initControllers()
    {
        require("./BlockchainController.js")(this.app);
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