/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 09/05/2023 18:28:17
 */
const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

/*
 * GET 
 */
router.post('/create-stripe-payment-intent', /*auth.admin,*/ paymentController.createStripePaymentIndent);
router.post('/create-paypal-payment-intent', /*auth.admin,*/ paymentController.createPaypalPaymentIndent);
router.post('/capture-paypal-order', /*auth.admin,*/ paymentController.capturePaypalPayment);
router.post('/capture-stripe-order', /*auth.admin,*/ paymentController.captureStripePayment);



module.exports = router;
