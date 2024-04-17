/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:31:47
 */
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ messageController.getMessages);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ messageController.getMessagesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ messageController.searchMessageByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ messageController.showMessageById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ messageController.createMessage);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ messageController.sortMessageByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ messageController.updateMessageById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ messageController.removeMessageById);

module.exports = router;
