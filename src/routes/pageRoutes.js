/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 05/05/2023 19:20:01
 */
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ pageController.getPages);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ pageController.getPagesByPage);

router.get('/by/slug/:slug', /*auth.admin,*/ pageController.showPageBySlug);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ pageController.searchPageByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ pageController.showPageById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ pageController.createPage);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ pageController.sortPageByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ pageController.updatePageById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ pageController.removePageById);

module.exports = router;
