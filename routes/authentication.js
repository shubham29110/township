const express = require('express');
const router = express.Router();
const Controller = require('../controller/userAuth');
const Authentication = require('../config/passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const middleware = require('../middleware/index')


router.get('/register', Controller.get_method_register );
  
router.post('/register', Controller.register);

router.get('/login', Controller.get_method_login);

/**
 * PASSPORT LOGIN 
 */
router.post('/login', middleware.checkValidity, passport.authenticate('local', {
    successRedirect:'/', 
failureRedirect:'/auth/login'}));


/**
 * FACEBOOK ROUTES
 * route for facebook authentication and login
 */
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));
  
  // handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback', Authentication.fbAuth);
  
  
  /**
   * GOOGLE ROUTES
   */
  router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  // the callback after google has authenticated the user
  router.get('/auth/google/callback', Authentication.googleAuth);

router.get('/logout', Controller.logout);


module.exports=router;