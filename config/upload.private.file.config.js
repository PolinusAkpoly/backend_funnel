const multer = require('multer');
const util = require("util");
const path = require("path");

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png'
// }

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'src/storage');
    },
    filename: (req, file, callback)=>{
        var name = Math.floor(Math.random() * Math.floor(15252452)).toString();
        name += Math.floor(Math.random() * Math.floor(854465)).toString();
        name += Date.now()+".";

        console.log(file);
        const extension = file.originalname.split('.').pop();
        name += extension;

        callback(null, name);
    }
})

var uploadPrivateFile = multer({ storage: storage }).array("videoFile");
var uploadPrivateFilesMiddleware = util.promisify(uploadPrivateFile);

module.exports = uploadPrivateFilesMiddleware;