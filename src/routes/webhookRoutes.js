/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 15:37:06
 */
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/webhook', /*auth.admin,*/ webhookController.webhook);


module.exports = router;
