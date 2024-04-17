/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 21:49:49
 */
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ contactController.getContacts);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ contactController.getContactsByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ contactController.searchContactByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ contactController.showContactById);

/*
 * POST
 */
router.post('/', /*auth.admin,*/ contactController.createContact);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ contactController.sortContactByPosition);

/*
 * PUT
 */
router.put('/:id', /*auth.admin,*/ contactController.updateContactById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ contactController.removeContactById);

module.exports = router;
