/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:59:34
 */
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController.js');
const uploadPrivateFilesMiddleware = require('../../config/upload.private.file.config.js');
const { auth } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/by/code/:uniqueCode', auth, videoController.watchVideo);
router.get('/read/:videoId' , videoController.readVideo);


router.get('/' ,auth, videoController.getVideos);

/*
 * GET 
 */
router.get('/by/page', auth, videoController.getVideosByPage);

/*
 * GET 
 */
router.get('/search', auth, videoController.searchVideoByTag);

/*
 * GET
 */
router.get('/:id', auth, videoController.showVideoById);
router.get('/by/unique-code/:uniqueCode', auth, videoController.showVideoByUniqueCode);

/*
 * POST
 */
router.post('/', auth, uploadPrivateFilesMiddleware, videoController.createVideo);
/*
 * POST
 */
router.post('/sort', auth, videoController.sortVideoByPosition);

/*
 * PUT
 */
router.put('/:id', uploadPrivateFilesMiddleware, auth, videoController.updateVideoById);

router.put('/by/uniqueCode/:uniqueCode', uploadPrivateFilesMiddleware, auth, videoController.updateVideoByUniqueCode);

/*
 * DELETE
 */
router.delete('/:id', auth, videoController.removeVideoById);

router.delete('/by/uniqueCode/:uniqueCode', auth, videoController.removeVideoByUnique);

module.exports = router;
