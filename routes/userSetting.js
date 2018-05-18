const express = require('express');
const router = express.Router();
const Controller = require('../controller/userAuth');
const PasswordController = require('../settings/passwordController')
const User = require('../models/user');





/**
 * FORGOT PASSWORD PAGE
 */
router.get('/forgot',PasswordController.get_method_forgot );
/**
 * FORGOT PASSWORD token generation 
 * EMAIL SENDING
 */
router.post('/forgot', PasswordController.post_method_forgot);
/**
 * RESET PAGE WITH get req 
 * Token in Url
 */
router.get('/reset/:token', PasswordController.get_token);
/**
 * RESET PAGE WITH post req
 * Token in Url
 * Token expires in 15 minutes
 */
router.post('/reset/:token', PasswordController.post_token);

router.get('/changePassword', PasswordController.get_method_changePassword);

router.post('/changePassword', PasswordController.post_method_changePassword);


module.exports = router;