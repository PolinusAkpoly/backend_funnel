const shell = require("shelljs");
const fs = require("fs");

const doc_name_origin = process.cwd().split("\\").pop()
const doc_name = process.cwd().split("\\").pop()+"_build"
console.log({doc_name});



shell.exec("node delete_source.js")
shell.exec("node generate_files.js")
shell.cd("..")
shell.mkdir(doc_name)
shell.mkdir(doc_name+"/src")
shell.mkdir("../"+doc_name+"/src/views")
shell.cd(doc_name_origin)
shell.cp("-R","build","../"+doc_name)
shell.cp("-R","public","../"+doc_name)
shell.cp("-R","src/views","../"+doc_name+"/src/")
shell.cp(".env","../"+doc_name)
shell.cp(".env","../"+doc_name+"/.prod")
shell.cp("files.json","../"+doc_name)
shell.cp(".gitignore","../"+doc_name)
shell.cp("package.json","../"+doc_name)
shell.exec("code ../"+doc_name)

const package = JSON.parse(fs.readFileSync("package.json"))

package.scripts = {
    build: "npm i && node build/e-commerce-server.js",
    start: "node build/e-commerce-server.js"
}




fs.writeFileSync("../"+doc_name+"/package.json", JSON.stringify(package, null, 4))

