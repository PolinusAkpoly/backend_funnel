/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 15/10/2023 12:14:17
 */
const express = require('express');
const router = express.Router();
const webinaireController = require('../controllers/webinaireController.js');
const { admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, webinaireController.getWebinaires);

/*
 * GET 
 */
router.get('/by/page', admin, webinaireController.getWebinairesByPage);

/*
 * GET 
 */
router.get('/search', admin, webinaireController.searchWebinaireByTag);

/*
 * GET
 */
router.get('/:id', admin, webinaireController.showWebinaireById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ admin, webinaireController.createWebinaire);
/*
 * POST
 */
router.post('/sort', admin, webinaireController.sortWebinaireByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ admin, webinaireController.updateWebinaireById);

/*
 * DELETE
 */
router.delete('/:id', admin, webinaireController.removeWebinaireById);

module.exports = router;
