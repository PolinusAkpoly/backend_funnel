/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/10/2023 09:25:53
 */
const express = require('express');
const router = express.Router();
const authstrategyController = require('../controllers/authStrategyController.js');
const { admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, authstrategyController.getAuthstrategys);

/*
 * GET 
 */
router.get('/by/page', admin, authstrategyController.getAuthstrategysByPage);

/*
 * GET 
 */
router.get('/search', admin, authstrategyController.searchAuthstrategyByTag);

/*
 * GET
 */
router.get('/:id', admin, authstrategyController.showAuthstrategyById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ admin, authstrategyController.createAuthstrategy);
/*
 * POST
 */
router.post('/sort', admin, authstrategyController.sortAuthstrategyByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ admin, authstrategyController.updateAuthstrategyById);

/*
 * DELETE
 */
router.delete('/:id', admin, authstrategyController.removeAuthstrategyById);

module.exports = router;
