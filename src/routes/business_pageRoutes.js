/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:48:20
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const business_pageController = require('../controllers/business_pageController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', business_pageController.getBusiness_pages);

/*
 * GET 
 */
router.get('/by/page', business_pageController.getBusiness_pagesByPage);

/*
 * GET 
 */
router.get('/search', business_pageController.searchBusiness_pageByTag);

/*
 * GET
 */
router.get('/:id', business_pageController.showBusiness_pageById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, business_pageController.createBusiness_page);
/*
 * POST
 */
router.post('/sort', auth, business_pageController.sortBusiness_pageByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, business_pageController.updateBusiness_pageById);

/*
 * DELETE
 */
router.delete('/:id', admin, business_pageController.removeBusiness_pageById);

module.exports = router;
