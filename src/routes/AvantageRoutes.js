/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 01/03/2024 11:01:43
 */
const express = require('express');
const router = express.Router();
const AvantageController = require('../controllers/AvantageController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ AvantageController.getAvantages);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ AvantageController.getAvantagesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ AvantageController.searchAvantageByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ AvantageController.showAvantageById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ AvantageController.createAvantage);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ AvantageController.sortAvantageByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ AvantageController.updateAvantageById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ AvantageController.removeAvantageById);

module.exports = router;
