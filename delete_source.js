const shell = require("shelljs");


const doc_name = process.cwd().split("\\").pop()+"_build"

console.log({doc_name});

shell.exec("webpack --mode=production --config webpack.config.js")
shell.cd("..")
shell.rm("-rf","../"+doc_name)




