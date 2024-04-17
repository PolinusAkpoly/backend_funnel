/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 30/05/2023 09:03:29
 */
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ addressController.getAddresss);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ addressController.getAddresssByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ addressController.searchAddressByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ addressController.showAddressById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ addressController.createAddress);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ addressController.sortAddressByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ addressController.updateAddressById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ addressController.removeAddressById);

module.exports = router;
