/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 15/10/2023 10:28:45
 */
const express = require('express');
const router = express.Router();
const emailEventController = require('../controllers/emailEventController.js');
const { admin } = require('../helpers/auth.js');
// const uploadFileConfig = require('../../config/upload.file.config.js');

/*
 * GET 
 */
router.get('/', admin, emailEventController.getEmailevents);

/*
 * GET 
 */
router.get('/by/page', admin, emailEventController.getEmaileventsByPage);

/*
 * GET 
 */
router.get('/search', admin, emailEventController.searchEmaileventByTag);

/*
 * GET
 */
router.get('/:id', admin, emailEventController.showEmaileventById);

/*
 * POST
 */
router.post('/', /*uploadFileConfig,*/ admin, emailEventController.createEmailevent);
/*
 * POST
 */
router.post('/sort', admin, emailEventController.sortEmaileventByPosition);

/*
 * PUT
 */
router.put('/:id', /*uploadFileConfig,*/ admin, emailEventController.updateEmaileventById);

/*
 * DELETE
 */
router.delete('/:id', admin, emailEventController.removeEmaileventById);

module.exports = router;
