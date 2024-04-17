/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:59:34
 */
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController.js');
const uploadPrivateFilesMiddleware = require('../../config/upload.private.file.config.js');
const { auth } = require('../helpers/auth.js');


router.get('/:uniqueCode', /*auth,*/ videoController.lectorVideo);

module.exports = router;
