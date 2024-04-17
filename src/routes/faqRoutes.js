/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 15:40:57
 */
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ faqController.getFaqs);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ faqController.getFaqsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ faqController.searchFaqByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ faqController.showFaqById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ faqController.createFaq);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ faqController.sortFaqByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ faqController.updateFaqById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ faqController.removeFaqById);

module.exports = router;
