/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/06/2023 17:08:10
 */
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');
const { auth } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ profileController.getProfiles);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ profileController.getProfilesByPage);

/*
 * GET 
 */
router.get('/search', auth, profileController.searchProfileByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ profileController.showProfileById);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ profileController.createProfile);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ profileController.sortProfileByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ profileController.updateProfileById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ profileController.removeProfileById);

module.exports = router;
