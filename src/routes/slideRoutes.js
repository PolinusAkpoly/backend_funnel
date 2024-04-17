/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 11:59:20
 */
const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController.js');
const { admin, auth } = require('../helpers/auth');
const uploadFileConfig = require('../../config/upload.multiple.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ slideController.getSlides);

/*
 * GET 
 */
router.get('/by/page', admin, slideController.getSlidesByPage);

/*
 * GET 
 */
router.get('/search', admin, slideController.searchSlideByTag);

/*
 * GET
 */
router.get('/:id', admin, slideController.showSlideById);

/*
 * POST
 */
router.post('/',uploadFileConfig, admin, slideController.createSlide);
/*
 * POST
 */
router.post('/sort', admin, slideController.sortSlideByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, admin, slideController.updateSlideById);

/*
 * DELETE
 */
router.delete('/:id', admin, slideController.removeSlideById);

module.exports = router;
