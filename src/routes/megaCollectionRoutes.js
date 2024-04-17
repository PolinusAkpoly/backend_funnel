/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 23/05/2023 08:14:16
 */
const express = require('express');
const router = express.Router();
const megaCollectionController = require('../controllers/megaCollectionController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ megaCollectionController.getMegacollections);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ megaCollectionController.getMegacollectionsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ megaCollectionController.searchMegacollectionByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ megaCollectionController.showMegacollectionById);

/*
 * POST
 */
router.post('/', uploadFileConfig, /*auth.admin,*/ megaCollectionController.createMegacollection);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ megaCollectionController.sortMegacollectionByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ megaCollectionController.updateMegacollectionById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ megaCollectionController.removeMegacollectionById);

module.exports = router;
