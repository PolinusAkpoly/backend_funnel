/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 09/05/2023 18:28:17
 */
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ articleController.getArticles);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ articleController.getArticlesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ articleController.searchArticleByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ articleController.showArticleById);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ articleController.createArticle);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ articleController.sortArticleByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ articleController.updateArticleById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ articleController.removeArticleById);

module.exports = router;
