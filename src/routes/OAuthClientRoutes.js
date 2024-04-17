/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 07/10/2023 10:56:14
 */
const express = require('express');
const router = express.Router();
const OAuthClientController = require('../controllers/oauthClientController.js');
const { auth, admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
// router.get('/:userId', auth, OAuthClientController.getOAuthClients);
router.get('/regenerate/:OAuthClientId', auth, OAuthClientController.regenerateOAuthClients);
router.get('/', auth, OAuthClientController.getOAuthClients);

/*
 * GET 
 */
router.get('/by/page', auth, OAuthClientController.getOAuthClientsByPage);

/*
 * GET 
 */
router.get('/search', auth, OAuthClientController.searchOAuthClientByTag);

/*
 * GET
 */
router.get('/:id', auth, OAuthClientController.showOAuthClientById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, OAuthClientController.createOAuthClient);
/*
 * POST
 */
router.post('/sort', auth, OAuthClientController.sortOAuthClientByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, OAuthClientController.updateOAuthClientById);

/*
 * DELETE
 */
router.delete('/:id', admin, OAuthClientController.removeOAuthClientById);

module.exports = router;
