const express = require('express');
const router = express.Router();
const PasswordController = require('../settings/passwordController')
const Authentication = require('../config/passport');
const Tenant = require('../controller/tenant');
const UserAuth = require('../controller/userAuth');
const middleware=require('../middleware/index')


router.get('/homeUser', middleware.ensureAuthenticated, Tenant.getHomePage);


module.exports=router