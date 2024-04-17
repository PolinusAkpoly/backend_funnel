/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/05/2023 14:05:59
 */
const express = require('express');
const router = express.Router();
const available_paymentController = require('../controllers/available_paymentController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');
const { admin } = require('../helpers/auth')

/*
 * GET 
 */
router.get('/', admin , available_paymentController.getAvailable_payments);

/*
 * GET 
 */
router.get('/by/page', admin, available_paymentController.getAvailable_paymentsByPage);

/*
 * GET 
 */
router.get('/search', admin, available_paymentController.searchAvailable_paymentByTag);

/*
 * GET
 */
router.get('/:id', admin, available_paymentController.showAvailable_paymentById);

/*
 * POST
 */
router.post('/', uploadFileConfig, admin, available_paymentController.createAvailable_payment);
/*
 * POST
 */
router.post('/sort', admin, available_paymentController.sortAvailable_paymentByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, admin, available_paymentController.updateAvailable_paymentById);

/*
 * DELETE
 */
router.delete('/:id', admin, available_paymentController.removeAvailable_paymentById);

module.exports = router;
