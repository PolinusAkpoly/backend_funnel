/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 25/06/2023 08:48:17
 */
const express = require('express');
const router = express.Router();
const manage_chatController = require('../controllers/manage_chatController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ manage_chatController.getManage_chats);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ manage_chatController.getManage_chatsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ manage_chatController.searchManage_chatByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ manage_chatController.showManage_chatById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ manage_chatController.createManage_chat);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ manage_chatController.sortManage_chatByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ manage_chatController.updateManage_chatById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ manage_chatController.removeManage_chatById);

module.exports = router;
