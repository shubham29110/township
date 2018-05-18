
const User = require('../models/user');
const Controller = require('../controller/userAuth')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


/**
 * LOCAL AUTHENTICATION BY PASSPORT
 */
passport.use(new LocalStrategy({ // or whatever you want to use
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
  },
	function (email, password, done) {
		Controller.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) { 
				return done(null, false, { message: 'Unknown User' });
			}

			Controller.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					console.log("+++++++++++++++++++++++++++++++++")
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	Controller.getUserById(id, function (err, user) {
		done(err, user);
	});
});


var configAuth = require('./socail');
/**
 * FACEBOOK AUTHENTICATION BY PASSPORT
 */
passport.use(new FacebookStrategy({

	// pull in our app id and secret from our auth.js file
	clientID: configAuth.facebookAuth.clientID,
	clientSecret: configAuth.facebookAuth.clientSecret,
	callbackURL: configAuth.facebookAuth.callbackURL

},

	// facebook will send back the token and profile
	function (token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function () {

			User.findOne({ 'socialuser_id': profile.id }, async function (err, user) {
				if (err)
					return done(err);
				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.socialuser_id = profile.id;
					newUser.facebook_token = token;
					newUser.name = profile.displayName
					newUser.provider = profile.provider;
					//newUser.facebook_email = profile.emails[0].valu // facebook can return multiple emails so we'll take the first

					// save our user to the database
					await newUser.save(function (err,user) {
						if (err)
							throw err;

						// return the new user
						return done(null, user);
					});
				}

			});
		});

	}));

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
module.exports.fbAuth = function (req, res, next) {
	passport.authenticate('facebook', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) { return res.json({ "message": info.message }); }
		res.redirect('/users/home')
	})(req, res, next)

}

/*module.exports={fbAuth:passport.authenticate('google', {
	successRedirect : '/home',
	failureRedirect : '/'
})}*/


/**
 * GOOGLE AUTHENTICATION BY PASSPORT
 */
passport.use(new GoogleStrategy({

	clientID: configAuth.googleAuth.clientID,
	clientSecret: configAuth.googleAuth.clientSecret,
	callbackURL: configAuth.googleAuth.callbackURL,

},
	function (token, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function () {

			// try to find the user based on their google id
			User.findOne({ 'socialuser_id': profile.id }, function (err, user) {
				if (err)
					return done(err);

				if (user) {

					// if a user is found, log them in
					return done(null, user);
				} else {
					// if the user isnt in our database, create a new user
					var newUser = new User();

					// set all of the relevant information
					newUser.socialuser_id = profile.id;
					newUser.google_token = token;
					newUser.name = profile.displayName;
					newUser.provider = profile.provider;
					//newUser.google_email = profile.emails[0].value; // pull the first email

					// save the user
					newUser.save(function (err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});

	}));
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
module.exports.googleAuth = function (req, res, next) {
	passport.authenticate('google', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.json({ "message": info.message });
		}
		res.redirect('/users/home')
	})(req, res, next)

}
