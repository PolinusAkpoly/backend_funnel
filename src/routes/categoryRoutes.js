/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 20:19:03
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const { auth } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/', auth, categoryController.getCategorys);

/*
 * GET 
 */
router.get('/by/page', auth, categoryController.getCategorysByPage);

/*
 * GET 
 */
router.get('/search', auth, categoryController.searchCategoryByTag);

/*
 * GET
 */
router.get('/:id', auth, categoryController.showCategoryById);

/*
 * POST
 */
router.post('/', auth, categoryController.createCategory);
/*
 * POST
 */
router.post('/sort', auth, categoryController.sortCategoryByPosition);

/*
 * PUT
 */
router.put('/:id', auth, categoryController.updateCategoryById);

/*
 * DELETE
 */
router.delete('/:id', auth, categoryController.removeCategoryById);

module.exports = router;
