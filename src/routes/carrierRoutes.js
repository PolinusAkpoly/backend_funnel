/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/09/2023 09:18:45
 */
const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ carrierController.getCarriers);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ carrierController.getCarriersByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ carrierController.searchCarrierByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ carrierController.showCarrierById);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ carrierController.createCarrier);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ carrierController.sortCarrierByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ carrierController.updateCarrierById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ carrierController.removeCarrierById);

module.exports = router;
