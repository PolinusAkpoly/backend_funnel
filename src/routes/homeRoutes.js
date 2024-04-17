/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 02/05/2023, 07:22:31
 */
const express = require('express');
const homeController = require('../controllers/homeController');
const router = express.Router();

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ homeController.home);


module.exports = router;