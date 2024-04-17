/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 26/11/2023 18:11:04
 */
const express = require('express');
const router = express.Router();
const clientDataController = require('../controllers/clientDataController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ clientDataController.getClientdatas);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ clientDataController.getClientdatasByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ clientDataController.searchClientdataByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ clientDataController.showClientdataById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ clientDataController.createClientdata);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ clientDataController.sortClientdataByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ clientDataController.updateClientdataById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ clientDataController.removeClientdataById);

module.exports = router;
