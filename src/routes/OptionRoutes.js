/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/02/2024 15:15:07
 */
const express = require('express');
const router = express.Router();
const OptionController = require('../controllers/OptionController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ OptionController.getOptions);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ OptionController.getOptionsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ OptionController.searchOptionByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ OptionController.showOptionById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ OptionController.createOption);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ OptionController.sortOptionByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ OptionController.updateOptionById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ OptionController.removeOptionById);

module.exports = router;
