/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 24/10/2023 18:01:59
 */
const express = require('express');
const router = express.Router();
const documentationController = require('../controllers/documentationController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');
const { admin } = require('../helpers/auth')

/*
 * GET 
 */
router.get('/',  documentationController.getDocumentations);

/*
 * GET 
 */
router.get('/by/page', admin, documentationController.getDocumentationsByPage);
router.get('/by/slug/:slug',  documentationController.getDocumentationsBySlug);

/*
 * GET 
 */
router.get('/search', admin, documentationController.searchDocumentationByTag);

/*
 * GET
 */
router.get('/:id', admin, documentationController.showDocumentationById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ admin, documentationController.createDocumentation);
/*
 * POST
 */
router.post('/sort', admin, documentationController.sortDocumentationByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ admin, documentationController.updateDocumentationById);

/*
 * DELETE
 */
router.delete('/:id', admin, documentationController.removeDocumentationById);

module.exports = router;
