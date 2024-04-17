/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 13:17:47
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const feedbackController = require('../controllers/feedbackController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', feedbackController.getFeedbacks);

/*
 * GET 
 */
router.get('/by/page', feedbackController.getFeedbacksByPage);

/*
 * GET 
 */
router.get('/search', feedbackController.searchFeedbackByTag);

/*
 * GET
 */
router.get('/:id', feedbackController.showFeedbackById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, feedbackController.createFeedback);
/*
 * POST
 */
router.post('/sort', auth, feedbackController.sortFeedbackByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, feedbackController.updateFeedbackById);

/*
 * DELETE
 */
router.delete('/:id', admin, feedbackController.removeFeedbackById);

module.exports = router;
