/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 17/06/2023 09:12:24
 */
const express = require('express');
const router = express.Router();
const socketController = require('../controllers/socketController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ socketController.getSockets);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ socketController.getSocketsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ socketController.searchSocketByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ socketController.showSocketById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ socketController.createSocket);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ socketController.sortSocketByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ socketController.updateSocketById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ socketController.removeSocketById);

module.exports = router;
