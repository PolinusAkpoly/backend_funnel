/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/05/2023 16:58:00
 */
const express = require('express');
const router = express.Router();
const email_paramaterController = require('../controllers/email_paramaterController.js');
const { admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/',  admin, email_paramaterController.getEmail_paramaters);

/*
 * GET 
 */
router.get('/by/page',  admin, email_paramaterController.getEmail_paramatersByPage);

/*
 * GET 
 */
router.get('/search',  admin, email_paramaterController.searchEmail_paramaterByTag);

/*
 * GET
 */
router.get('/:id',  admin, email_paramaterController.showEmail_paramaterById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/  admin, email_paramaterController.createEmail_paramater);
/*
 * POST
 */
router.post('/sort',  admin, email_paramaterController.sortEmail_paramaterByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/  admin, email_paramaterController.updateEmail_paramaterById);

/*
 * DELETE
 */
router.delete('/:id',  admin, email_paramaterController.removeEmail_paramaterById);

module.exports = router;
