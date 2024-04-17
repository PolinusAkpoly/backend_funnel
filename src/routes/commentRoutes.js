/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:15:07
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const commentController = require('../controllers/commentController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', commentController.getComments);

/*
 * GET 
 */
router.get('/by/page', auth, commentController.getCommentsByPage);

/*
 * GET 
 */
router.get('/search', commentController.searchCommentByTag);

/*
 * GET
 */
router.get('/:id', commentController.showCommentById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, commentController.createComment);
/*
 * POST
 */
router.post('/sort', auth, commentController.sortCommentByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, commentController.updateCommentById);

/*
 * DELETE
 */
router.delete('/:id', admin, commentController.removeCommentById);

module.exports = router;
