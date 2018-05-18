const mongoose = require('mongoose');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require('connect-flash');
var bcrypt = require('bcryptjs');

module.exports.get_method_register=function (req, res) {
	res.render('register');
  }

module.exports.get_method_login=function (req, res) {
    res.render('login');
  }


/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.register = async function (req, res) {
	try {

		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;

		// Validation
		req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();

		if (errors) {
			res.render('register', {
				errors: errors
			});
		}
		else {
			//checking for email and username are already taken
			var user = await User.findOne({
				username: {
					"$regex": "^" + username + "\\b", "$options": "i"
				}
			});

			var mail = await User.findOne({ email: { "$regex": "^" + email + "\\b", "$options": "i" } })

			if (user || mail) {
				res.render('register', {user: user,	mail: mail});
			}
			else {
				console.log("admin code", req.body.adminCode);

				var newUser = new User({
					name: name,
					email: email,
					username: username,
					password: password,

				});
				
				User.createUser = async function () {
					var salt = await bcrypt.genSalt(10)
					var hash = await bcrypt.hash(newUser.password, salt)
					if (hash) {
						newUser.password = hash;
						let user = await newUser.save();
						if (user) {
							console.log(user)
							req.flash('success_msg', 'You are registered and can now login');
							res.redirect('/auth/login');
						}
					}
				}();

			}

			;

		};

	} catch (error) {
		console.log(error);
		throw error
	}
}



/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.home = async function (req, res) {
	try{
		let user = await User.findById(req._passport.session.user)

		res.render('index', { "user": true, user: user });
	}catch(err){
		res.send(err);
	}
	
}


/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.logout = function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/auth/login');
}


//PASSPORT FUNCTIONS
/**
 * @param {String} username 
 * @param {function} callback 
 */
module.exports.getUserByEmail = function (email, callback) {
	var query = { email: email };
	User.findOne(query, callback);
}

/**
 * @param {Object} id 
 * @param {function} callback 
 */
module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

/**
 * 
 * @param {String} candidatePassword 
 * @param {String} hash 
 * @param {Function} callback 
 */
module.exports.comparePassword = async function (candidatePassword, hash, callback) {
	var isMatch = await bcrypt.compare(candidatePassword, hash)
	callback(null, isMatch);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 */
module.exports.get_method_acceptInvitation=async function(req,res){
	try {
			console.log(req.params.token)
			var user = await User.findOne({token:req.params.token})
			if(user){
				res.render('invitation', { token: req.params.token, email: user.email });
			}else{
				res.send("user not found"+ user)
			}	
	} catch (error) {
		console.log(error)
		res.send(error)
	}
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 */
module.exports.post_method_acceptInvitation = async function (req, res, next) {
		try {
			var token = req.body.token
			let user = await User.findOne({ token: token })
			
			if (user) {
				var newUser ={
					name: req.body.name,
					username: req.body.username,
					token: ""
				};
				let salt = await bcrypt.genSalt(10)
					let hash = await bcrypt.hash(req.body.password, salt)
					if (hash) {
						newUser.password = hash;
						newUser.status = true;
					}
				user = await User.findOneAndUpdate({token: token}, newUser);
				if (user) {
					res.redirect("/auth/login")
				}
			}
		} catch (error) {
			res.send(error)
		}

	}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.changeStatus = async function (req, res) {
    try {
        let id = req.body.user_id,
            status = req.body.user_status;
        let newStatus;
        if (status === 'true') {
            newStatus = false
        } else newStatus = true;

        let result = await User.findByIdAndUpdate(id, { status: newStatus });
        if (result) {
            res.json({ 'message': 'success' });
        }
    } catch (err) {
        res.send(err.message)
    }
}
