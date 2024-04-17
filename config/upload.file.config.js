const multer = require('multer');
const util = require("util");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/assets/files');
    },
    filename: (req, file, callback) => {
        const uniquePrefix = Math.floor(Math.random() * 15252).toString() + Math.floor(Math.random() * 854465).toString();
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);

        const name = `${uniquePrefix}-${timestamp}${extension}`;

        // Comment out the following line in production
        //console.log(file);

        callback(null, name);
    }
})

var uploadFiles = multer({ storage: storage }).array("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;