/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 11:02:14
 */
const express = require('express');
const router = express.Router();
const videoResolutionController = require('../controllers/videoResolutionController.js');
const { admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, videoResolutionController.getVideoresolutions);

/*
 * GET 
 */
router.get('/by/page', admin, videoResolutionController.getVideoresolutionsByPage);

/*
 * GET 
 */
router.get('/search', admin, videoResolutionController.searchVideoresolutionByTag);

/*
 * GET
 */
router.get('/:id', admin, videoResolutionController.showVideoresolutionById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ admin, videoResolutionController.createVideoresolution);
/*
 * POST
 */
router.post('/sort', admin, videoResolutionController.sortVideoresolutionByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ admin, videoResolutionController.updateVideoresolutionById);

/*
 * DELETE
 */
router.delete('/:id', admin, videoResolutionController.removeVideoresolutionById);

module.exports = router;
