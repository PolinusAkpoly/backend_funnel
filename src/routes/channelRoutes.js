/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 10/10/2023 14:47:42
 */
const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');
const { auth } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/', auth, channelController.getChannels);

/*
 * GET 
 */
router.get('/by/page', auth , channelController.getChannelsByPage);

/*
 * GET 
 */
router.get('/search', auth, channelController.searchChannelByTag);

/*
 * GET
 */
router.get('/:id', auth, channelController.showChannelById);

/*
 * POST
 */
router.post('/', auth,uploadFileConfig,  channelController.createChannel);
/*
 * POST
 */
router.post('/sort', auth, channelController.sortChannelByPosition);

/*
 * PUT
 */
router.put('/:id', auth, uploadFileConfig,  channelController.updateChannelById);

/*
 * DELETE
 */
router.delete('/:id', auth, channelController.removeChannelById);

module.exports = router;
