const express = require('express');
const router = express.Router();
const PasswordController = require('../settings/passwordController')
const Authentication = require('../config/passport');
const Controller = require('../controller/adminController');
const UserAuth = require('../controller/userAuth');
const middleware = require('../middleware/index')

router.get('/homeAdmin',middleware.ensureAuthenticated,Controller.get_homePage);

router.post('/invite', Controller.invite );

router.post('/re-invite', Controller.reInvite);

router.post('/changeStatus', UserAuth.changeStatus)


module.exports=router