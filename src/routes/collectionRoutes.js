/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 13:56:11
 */
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ collectionController.getCollections);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ collectionController.getCollectionsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ collectionController.searchCollectionByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ collectionController.showCollectionById);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ collectionController.createCollection);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ collectionController.sortCollectionByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ collectionController.updateCollectionById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ collectionController.removeCollectionById);

module.exports = router;
