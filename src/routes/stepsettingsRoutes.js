/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/02/2024 20:25:10
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const stepsettingsController = require('../controllers/stepsettingsController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, stepsettingsController.getStepsettingss);
router.get('/user/:tunnelId/:stepId', auth, stepsettingsController.getStepsettingsByTunnel);


/*
 * GET 
 */
router.get('/by/page', auth, stepsettingsController.getStepsettingssByPage);

/*
 * GET 
 */
router.get('/search', auth, stepsettingsController.searchStepsettingsByTag);

/*
 * GET
 */
router.get('/:id', auth, stepsettingsController.showStepsettingsById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, stepsettingsController.createStepsettings);

router.get('/template/:tunnelId/:stepId', auth, stepsettingsController.getStepTemplate);

router.post('/template/:tunnelId/:stepId', auth, stepsettingsController.addStepTemplate);
/*
 * POST
 */
router.post('/sort', auth, stepsettingsController.sortStepsettingsByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, stepsettingsController.updateStepsettingsById);

/*
 * DELETE
 */
router.delete('/:id', auth, stepsettingsController.removeStepsettingsById);

module.exports = router;
