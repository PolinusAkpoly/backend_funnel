/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:19:59
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const TunnelController = require('../controllers/TunnelController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ TunnelController.getTunnels);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ TunnelController.getTunnelsByPage);

/*
* GET 
*/
router.get('/search', /*auth.admin,*/ TunnelController.searchTunnelByTag);

/*
* GET
*/
router.get('/:id', auth, TunnelController.showTunnelById);
router.get('/by/userid/', auth, TunnelController.showTunnelByUserId);

/*
 * POST
 */
router.post('/', auth, TunnelController.createTunnel);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ TunnelController.sortTunnelByPosition);

/*
 * PUT
 */
router.put('/:id', auth, /*auth.admin,*/ TunnelController.updateTunnelById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ TunnelController.removeTunnelById);

module.exports = router;
