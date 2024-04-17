/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 31/01/2024 10:22:55
 */
const express = require('express');
const router = express.Router();
const navitemController = require('../controllers/navitemController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ navitemController.getNavitems);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ navitemController.getNavitemsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ navitemController.searchNavitemByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ navitemController.showNavitemById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ navitemController.createNavitem);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ navitemController.sortNavitemByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ navitemController.updateNavitemById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ navitemController.removeNavitemById);

module.exports = router;
