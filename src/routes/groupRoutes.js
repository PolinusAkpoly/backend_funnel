/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 21/07/2023 12:44:17
 */
const express = require('express');
const router = express.Router();
const { admin, auth } = require('../helpers/auth');
const groupController = require('../controllers/groupController.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', groupController.getGroups);

/*
 * GET 
 */
router.get('/by/page', groupController.getGroupsByPage);

/*
 * GET 
 */
router.get('/search', groupController.searchGroupByTag);

/*
 * GET
 */
router.get('/:id', groupController.showGroupById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ auth, groupController.createGroup);
/*
 * POST
 */
router.post('/sort', auth, groupController.sortGroupByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ auth, groupController.updateGroupById);

/*
 * DELETE
 */
router.delete('/:id', admin, groupController.removeGroupById);

module.exports = router;
