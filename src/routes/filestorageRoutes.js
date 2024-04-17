/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 15/02/2024 18:15:05
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const uploadFileConfig = require('../../config/upload.multiple.js');
const filestorageController = require('../controllers/filestorageController.js');

/*
 * GET 
 */
router.get('/', admin, filestorageController.getFilestorages);

/*
 * GET 
 */
router.get('/by/page', auth, filestorageController.getFilestoragesByPage);

/*
 * GET 
 */
router.get('/search', admin, filestorageController.searchFilestorageByTag);
router.get('/by/userId', auth, filestorageController.searchFilestorageByTagAndUserId);

/*
 * GET
 */
router.get('/:id', auth, filestorageController.showFilestorageById);

/*
 * POST
 */
router.post('/', uploadFileConfig,  auth, filestorageController.createFilestorage);
/*
 * POST
 */
router.post('/sort', auth, filestorageController.sortFilestorageByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, auth, filestorageController.updateFilestorageById);

/*
 * DELETE
 */
router.delete('/:id', auth, filestorageController.removeFilestorageById);

module.exports = router;
