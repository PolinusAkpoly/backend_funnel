const fs = require("fs")

fs.readdir("./src/controllers", (err, files)=>{
    if(err) return;

    files = files.filter(name => name.toLowerCase() !== "homecontroller.js" )

    files = files.map((file)=>{

        const index = file.search("Controller.js")
        const model = file.replace("Controller", "Model")

        let name = file.slice(0, index);

        return {
            name: name,
            datas: [
                {
                    "path": name,
                    "method": "GET",
                    "className": "route-get",
                    "description": "get all "+name,
                    parameters:null,
                    returns:{
                        200:{
                            description: "Request successfully",
                        },
                        500:{
                            description: "Serveur error"
                        }
                    }
                },
                {
                    "path": name+"/{id}",
                    "method": "GET",
                    "className": "route-get",
                    "description": "Get by "+name+" by Id",
                    parameters: {
                        id: {
                            requied: true,
                        }
                    },
                    returns:{
                        200:{
                            description: "Request successfully",
                        },
                        500:{
                            description: "Serveur error"
                        }
                    }
                },
                {
                    "path": name+"/search",
                    "method": "GET",
                    "className": "route-get",
                    "description": "Search in "+name+" by tag",
                    parameters: {
                        tag: {
                            requied: true,
                        }
                    },
                    returns:{
                        200:{
                            description: "Request successfully",
                            results: {
                                isSuccess: {
                                    value: true,
                                },
                            }
                        },
                        500:{
                            description: "Serveur error"
                        }
                    }
                },
                {
                    "path": name+"/by/page",
                    "method": "GET",
                    "className": "route-get",
                    "description": ""
                },
                {
                    "path": name,
                    "method": "POST",
                    "className": "route-post",
                    "description": ""
                },
                {
                    "path": name+"/{id}",
                    "method": "PUT",
                    "className": "route-put",
                    "description": ""
                },
                {
                    "path": name+"/{id}",
                    "method": "DELETE",
                    "className": "route-delete",
                    "description": ""
                }
            ]
        }
    })

    fs.writeFileSync("files.json", JSON.stringify(files, null, 4))


})