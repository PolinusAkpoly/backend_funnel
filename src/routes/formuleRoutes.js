/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/02/2024 15:20:41
 */
const express = require('express');
const router = express.Router();
const FormuleController = require('../controllers/FormuleController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ FormuleController.getFormules);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ FormuleController.getFormulesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ FormuleController.searchFormuleByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ FormuleController.showFormuleById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ FormuleController.createFormule);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ FormuleController.sortFormuleByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ FormuleController.updateFormuleById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ FormuleController.removeFormuleById);

module.exports = router;
