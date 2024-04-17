/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 03/05/2023, 18:35:24
 */
const express = require('express');
const { admin, auth } = require('../helpers/auth');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { accessAdmin } = require('../helpers/utils');

/*
 * GET 
 * Get all Users
 */
router.get('/', admin, userController.getUsers);

/*
 * GET 
 * Get all Users by page
 */
router.get('/by/page', admin, userController.getUsersByPage);


router.get('/search', admin, userController.searchUserByTag);

/*
 * GET 
 * Get one User
 */
router.get('/friends/:userId',auth, userController.getUserFiends);
router.get('/:id', auth, userController.showUserById);

/*
 * POST  
 * Create one Users
 */
router.post('/', admin, userController.createUser);


router.post('/verify/token',  userController.verifyAuthToken);



/*
 * POST
 * Signin one User
 */
router.post('/signin', accessAdmin, userController.signinUser);

/*
 * POST
 * Signup one User
 */
router.post('/signup',  userController.signupUser);
router.post('/authenticate', userController.authenticate);
router.post('/authenticate/email', userController.authenticateEmail);
router.post('/reset/password', userController.resetPassword);
router.post('/verify/code', userController.verifyCode);
router.post('/verify/email/code', userController.verifyEmailCode);
router.post('/resend/code', userController.resendCode);
router.post('/resend/verify/email/code', userController.resendVerifyEmailCode);

/*
 * POST
 * Signup one User
 */
router.post('/signup', userController.signupUser);
router.post('/signup/and/authenticate', userController.signupAndAuthenticateUser);


/*
 * POST
 * Sort Users data by position
 */
router.post('/sort', admin, userController.sortUserByPosition);


/*
 * PUT
 * Update one User
 */
router.put('/:id', auth, userController.updateUserById);

/*
 * DELETE
 * Delete one User
 */
router.delete('/:id', admin, userController.removeUserById);

module.exports = router;
