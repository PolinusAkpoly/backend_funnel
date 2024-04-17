/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/01/2024 12:09:18
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const ServiceController = require('../controllers/ServiceController.js');
const uploadFileConfig = require('../../config/upload.multiple.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ ServiceController.getServices);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ ServiceController.getServicesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ ServiceController.searchServiceByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ ServiceController.showServiceById);

/*
 * POST
 */
router.post('/', uploadFileConfig, admin, ServiceController.createService);
/*
 * POST
 */
router.post('/sort', admin, ServiceController.sortServiceByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, admin, ServiceController.updateServiceById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ ServiceController.removeServiceById);

module.exports = router;
