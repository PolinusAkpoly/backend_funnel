/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 09:10:48
 */
const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ newsletterController.getNewsletters);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ newsletterController.getNewslettersByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ newsletterController.searchNewsletterByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ newsletterController.showNewsletterById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ newsletterController.createNewsletter);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ newsletterController.sortNewsletterByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ newsletterController.updateNewsletterById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ newsletterController.removeNewsletterById);

module.exports = router;
