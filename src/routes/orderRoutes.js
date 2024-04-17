/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 19:21:59
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ orderController.getOrders);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ orderController.getOrdersByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ orderController.searchOrderByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ orderController.showOrderById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ orderController.createOrder);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ orderController.sortOrderByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ orderController.updateOrderById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ orderController.removeOrderById);

module.exports = router;
