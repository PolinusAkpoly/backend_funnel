/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 02/08/2023 17:04:13
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const post_feedbackController = require('../controllers/post_feedbackController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', post_feedbackController.getPost_feedbacks);

/*
 * GET 
 */
router.get('/by/page', auth, post_feedbackController.getPost_feedbacksByPage);
router.get('/by/post/:postId', auth, post_feedbackController.getPost_feedbacksByPost);

/*
 * GET 
 */
router.get('/search', post_feedbackController.searchPost_feedbackByTag);

/*
 * GET
 */
router.get('/:id', post_feedbackController.showPost_feedbackById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, post_feedbackController.createPost_feedback);
router.post('/add', /*uploadFileConfig,*/ auth, post_feedbackController.addPost_feedback);
/*
 * POST
 */
router.post('/sort', auth, post_feedbackController.sortPost_feedbackByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, post_feedbackController.updatePost_feedbackById);

/*
 * DELETE
 */
router.delete('/:id', admin, post_feedbackController.removePost_feedbackById);

module.exports = router;
