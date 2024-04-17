/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 11:08:06
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const postController = require('../controllers/postController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, postController.getPosts);

/*
 * GET 
 */
router.get('/by/page', auth, postController.getPostsByPage);

/*
 * GET 
 */
router.get('/search', postController.searchPostByTag);

/*
 * GET
 */
router.get('/:id', postController.showPostById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, postController.createPost);
/*
 * POST
 */
router.post('/sort', auth, postController.sortPostByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, postController.updatePostById);

/*
 * DELETE
 */
router.delete('/:id', admin, postController.removePostById);

module.exports = router;
