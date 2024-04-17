/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 29/09/2023 17:11:13
 */
const express = require('express');
const router = express.Router();
const client_authorizedController = require('../controllers/client_authorizedController.js');
const  auth  = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', auth.admin, client_authorizedController.getClient_authorizeds);

/*
 * GET 
 */
router.get('/by/page', auth.admin, client_authorizedController.getClient_authorizedsByPage);

/*
 * GET 
 */
router.get('/search', auth.admin, client_authorizedController.searchClient_authorizedByTag);

/*
 * GET
 */
router.get('/:id', auth.admin, client_authorizedController.showClient_authorizedById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth.admin, client_authorizedController.createClient_authorized);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ client_authorizedController.sortClient_authorizedByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth.admin, client_authorizedController.updateClient_authorizedById);

/*
 * DELETE
 */
router.delete('/:id', auth.admin, client_authorizedController.removeClient_authorizedById);

module.exports = router;
