/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 20:22:46
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ productController.getProducts);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ productController.getProductsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ productController.searchProductByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ productController.showProductById);


router.get('/by/slug/:slug', /*auth.admin,*/ productController.showProductBySlug);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ productController.createProduct);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ productController.sortProductByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ productController.updateProductById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ productController.removeProductById);

module.exports = router;
