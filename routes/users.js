const express = require('express');
const router = express.Router();
const Controller = require('../controller/userAuth');
const PasswordController = require('../settings/passwordController')
const User = require('../models/user');
const Authentication = require('../config/passport');
const middleware=require('../middleware/index')


/**
 * User HOME ROUTE
 */
router.get('/home', middleware.ensureAuthenticated, Controller.home)

router.get('/reset/:token', PasswordController.get_token);

router.post('/reset/:token', PasswordController.post_token);

router.get('/invitation/:token', Controller.get_method_acceptInvitation );

router.post('/invitation', Controller.post_method_acceptInvitation );



module.exports = router;