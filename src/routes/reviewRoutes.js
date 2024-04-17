/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 04/06/2023 11:06:19
 */
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ reviewController.getReviews);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ reviewController.getReviewsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ reviewController.searchReviewByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ reviewController.showReviewById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ reviewController.createReview);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ reviewController.sortReviewByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ reviewController.updateReviewById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ reviewController.removeReviewById);

module.exports = router;
