/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 06:35:41
 */
const express = require('express');
const router = express.Router();
const orderdetailController = require('../controllers/orderdetailController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ orderdetailController.getOrderdetails);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ orderdetailController.getOrderdetailsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ orderdetailController.searchOrderdetailByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ orderdetailController.showOrderdetailById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ orderdetailController.createOrderdetail);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ orderdetailController.sortOrderdetailByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ orderdetailController.updateOrderdetailById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ orderdetailController.removeOrderdetailById);

module.exports = router;
