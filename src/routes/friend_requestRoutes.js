/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/07/2023 15:01:18
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const friend_requestController = require('../controllers/friend_requestController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', friend_requestController.getFriend_requests);

/*
 * GET 
 */
router.get('/by/page', friend_requestController.getFriend_requestsByPage);

/*
 * GET 
 */
router.get('/receive', auth,  friend_requestController.getReceiveFriend_requests);
router.get('/send', auth,  friend_requestController.getSendFriend_requests);
router.put('/confirm/:requestId', auth,  friend_requestController.confirmFriend_requests);
router.get('/search', auth,  friend_requestController.searchFriend_requestByTag);

/*
 * GET
 */
router.get('/:id', friend_requestController.showFriend_requestById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, friend_requestController.createFriend_request);
/*
 * POST
 */
router.post('/sort', auth, friend_requestController.sortFriend_requestByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, friend_requestController.updateFriend_requestById);

/*
 * DELETE
 */
router.delete('/:id', auth, friend_requestController.removeFriend_requestById);
router.delete('/delete/:senderId', auth, friend_requestController.removeSenderFriend_requestById);

module.exports = router;
