/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 18:50:51
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const website_fileController = require('../controllers/website_fileController.js');
const uploadFileConfig = require('../../config/upload.multiple.js');

/*
 * GET 
 */
router.get('/', website_fileController.getWebsite_files);

/*
 * GET 
 */
router.get('/by/page', admin, website_fileController.getWebsite_filesByPage);

/*
 * GET 
 */
router.get('/search', admin, website_fileController.searchWebsite_fileByTag);

/*
 * GET
 */
router.get('/:id', admin, website_fileController.showWebsite_fileById);

/*
 * POST
 */
router.post('/', uploadFileConfig, admin, website_fileController.createWebsite_file);
/*
 * POST
 */
router.post('/sort', admin, website_fileController.sortWebsite_fileByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, admin, website_fileController.updateWebsite_fileById);

/*
 * DELETE
 */
router.delete('/:id', admin, website_fileController.removeWebsite_fileById);

module.exports = router;
