/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:19:13
 */
const express = require('express');
const router = express.Router();
const TunnelStepTypeController = require('../controllers/TunnelStepTypeController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ TunnelStepTypeController.getTunnelsteptypes);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ TunnelStepTypeController.getTunnelsteptypesByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ TunnelStepTypeController.searchTunnelsteptypeByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ TunnelStepTypeController.showTunnelsteptypeById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ /*auth.admin,*/ TunnelStepTypeController.createTunnelsteptype);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ TunnelStepTypeController.sortTunnelsteptypeByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ /*auth.admin,*/ TunnelStepTypeController.updateTunnelsteptypeById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ TunnelStepTypeController.removeTunnelsteptypeById);

module.exports = router;
