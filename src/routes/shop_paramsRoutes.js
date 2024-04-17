/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/06/2023 15:37:06
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const shop_paramsController = require('../controllers/shop_paramsController.js');
const uploadFileConfig = require('../../config/upload.multiple.js');

/*
 * GET 
 */
router.get('/', admin, shop_paramsController.getShop_paramss);

/*
 * GET 
 */
router.get('/by/page', admin, shop_paramsController.getShop_paramssByPage);

/*
 * GET 
 */
router.get('/search', admin, shop_paramsController.searchShop_paramsByTag);

/*
 * GET
 */
router.get('/:id', admin, shop_paramsController.showShop_paramsById);

/*
 * POST
 */
router.post('/', uploadFileConfig, admin, shop_paramsController.createShop_params);
/*
 * POST
 */
router.post('/sort', admin, shop_paramsController.sortShop_paramsByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, admin, shop_paramsController.updateShop_paramsById);

/*
 * DELETE
 */
router.delete('/:id', admin, shop_paramsController.removeShop_paramsById);

module.exports = router;
