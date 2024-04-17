const fs = require("fs");
const shop_paramsModel = require("../models/shop_paramsModel");





module.exports = {
    home: async (req, res) =>{
        var {host, referer} = req.headers

        console.log({referer: req.headers.referer});
        
        let data = fs.readFileSync("files.json")

        const params = await shop_paramsModel.findOne({})

        
        let files = JSON.parse(data);
        
        const logo = "/assets"+params?.logo.split("/assets")[1]
        const hostValue = await req.headers.referer
        
        console.log({logo});

        return res.render("index.twig", {
            host: hostValue,
            files,
            name: params?.name,
            description: params?.description,
            logo: logo,
        })
    }
}