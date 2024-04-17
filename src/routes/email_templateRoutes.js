/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 16:42:42
 */
const express = require('express');
const router = express.Router();
const email_templateController = require('../controllers/email_templateController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');
const { admin } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/', admin, email_templateController.getEmail_templates);

/*
 * GET 
 */
router.get('/by/page', admin, email_templateController.getEmail_templatesByPage);

/*
 * GET 
 */
router.get('/search', admin, email_templateController.searchEmail_templateByTag);

/*
 * GET
 */
router.get('/:id', admin, email_templateController.showEmail_templateById);

/*
 * POST
 */
router.post('/', admin, uploadFileConfig,  email_templateController.createEmail_template);
/*
 * POST
 */
router.post('/sort', admin, email_templateController.sortEmail_templateByPosition);

/*
 * PUT
 */
router.put('/:id', admin, uploadFileConfig,  email_templateController.updateEmail_templateById);

/*
 * DELETE
 */
router.delete('/:id', admin, email_templateController.removeEmail_templateById);

module.exports = router;
