/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 25/06/2023 08:51:01
 */
const express = require('express');
const router = express.Router();
const manage_messageController = require('../controllers/manage_messageController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ manage_messageController.getManage_messages);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ manage_messageController.getManage_messagesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ manage_messageController.searchManage_messageByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ manage_messageController.showManage_messageById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ manage_messageController.createManage_message);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ manage_messageController.sortManage_messageByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ manage_messageController.updateManage_messageById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ manage_messageController.removeManage_messageById);

module.exports = router;
