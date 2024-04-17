/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:54:14
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const storyController = require('../controllers/storyController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', storyController.getStorys);

/*
 * GET 
 */
router.get('/by/page', storyController.getStorysByPage);

/*
 * GET 
 */
router.get('/search', storyController.searchStoryByTag);

/*
 * GET
 */
router.get('/:id', storyController.showStoryById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, storyController.createStory);
/*
 * POST
 */
router.post('/sort', auth, storyController.sortStoryByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, storyController.updateStoryById);

/*
 * DELETE
 */
router.delete('/:id', admin, storyController.removeStoryById);

module.exports = router;
