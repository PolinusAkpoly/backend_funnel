/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 11/06/2023 19:35:08
 */
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../helpers/auth.js');
const chatController = require('../controllers/chatController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/by/page', admin, chatController.getChatsByPage);

router.get('/', admin, chatController.getChats);
router.get('/user/:userId', auth, chatController.getChatsByUser);
router.post('/archive/:chatId/:userId', /*auth.admin,*/ chatController.archiveChat);
router.post('/unarchive/:chatId/:userId', /*auth.admin,*/ chatController.unarchiveChat);
router.post('/remove/:chatId/:userId', /*auth.admin,*/ chatController.removeChat);

router.get('/:senderId', auth, chatController.list);

router.get('/messages/:chatId', auth,  chatController.listChatMessages);
router.post('/message/remove/:messageId/:userId', /*auth.admin,*/  chatController.removeMessage);
router.post('/message/clear/:messageId/:userId', /*auth.admin,*/  chatController.clearMessage);

router.post('/messages/unread/', /*auth.admin,*/  chatController.listUnread);

router.post('/read/:chatId', auth,  chatController.readMessage);

// router.post('/save/file', /*auth.admin,*/  multerConfig , chatController.saveFiles);


router.get('/chat/message/:userId/:chatId', /*auth.admin,*/ chatController.getChatMessages);

/*
 * GET 
 */

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ chatController.searchChatByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ chatController.showChatById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ chatController.createChat);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ chatController.sortChatByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ chatController.updateChatById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ chatController.removeChatById);

module.exports = router;
