/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:28:13
 */
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ fileController.getFiles);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ fileController.getFilesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ fileController.searchFileByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ fileController.showFileById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ fileController.createFile);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ fileController.sortFileByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ fileController.updateFileById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ fileController.removeFileById);

module.exports = router;
