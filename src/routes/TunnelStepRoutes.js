/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 28/01/2024 19:18:32
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const TunnelStepController = require('../controllers/TunnelStepController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', auth, TunnelStepController.getTunnelsteps);

/*
 * GET 
 */
router.get('/by/page', auth, TunnelStepController.getTunnelstepsByPage);

/*
 * GET 
 */
router.get('/search', auth, TunnelStepController.searchTunnelstepByTag);

/*
 * GET
 */
router.get('/:id', auth, TunnelStepController.showTunnelstepById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, TunnelStepController.createTunnelstep);
/*
 * POST
 */
router.post('/sort', auth, TunnelStepController.sortTunnelstepByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, TunnelStepController.updateTunnelstepById);

/*
 * DELETE
 */
router.delete('/:id', auth, TunnelStepController.removeTunnelstepById);

module.exports = router;
