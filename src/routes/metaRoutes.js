/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 22/05/2023 14:37:22
 */
const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController.js');
const { admin } = require('../helpers/auth.js');

/*
 * GET 
 */
router.get('/', admin, metaController.getMetas);

/*
 * GET 
 */
router.get('/by/page', admin, metaController.getMetasByPage);

/*
 * GET 
 */
router.get('/search', admin, metaController.searchMetaByTag);

/*
 * GET
 */
router.get('/:id', admin, metaController.showMetaById);

/*
 * POST
 */
router.post('/', admin, metaController.createMeta);
/*
 * POST
 */
router.post('/sort', admin, metaController.sortMetaByPosition);

/*
 * PUT
 */
router.put('/:id', admin, metaController.updateMetaById);

/*
 * DELETE
 */
router.delete('/:id', admin, metaController.removeMetaById);

module.exports = router;
