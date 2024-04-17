/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/01/2024 09:57:30
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const TemplateController = require('../controllers/TemplateController.js');
const uploadMultipleConfig = require('../../config/upload.multiple.js');

/*
 * GET 
 */
router.get('/',auth, TemplateController.getTemplates);
router.get('/link/:id',auth, TemplateController.getTemplateLink);

/*
 * GET 
 */
router.get('/by/page', auth, TemplateController.getTemplatesByPage);

/*
 * GET 
 */
router.get('/search', auth, TemplateController.searchTemplateByTag);

/*
 * GET
 */
router.get('/:id', auth, TemplateController.showTemplateById);

/*
 * POST
 */
router.post('/', uploadMultipleConfig, admin, TemplateController.createTemplate);
/*
 * POST
 */
router.post('/sort', admin, TemplateController.sortTemplateByPosition);

/*
 * PUT
 */
router.put('/:id', uploadMultipleConfig, admin, TemplateController.updateTemplateById);

/*
 * DELETE
 */
router.delete('/:id', admin, TemplateController.removeTemplateById);

module.exports = router;
