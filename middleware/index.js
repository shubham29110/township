var buildings = require('../models/building')
var User = require('../models/user')

module.exports.ensureAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/auth/login');
	}
}

module.exports.checkBuilding = async function(req, res, next){
	console.log('working')
	let user = await User.findById(req._passport.session.user);
	if(user.role == 'superAdmin' ||user.role === 'user'){
		return next();
	}
	let building = await buildings.findOne({owner_id: req._passport.session.user});
	if(building){
		return next();
	}else{
    return res.redirect('/buildings/building');
     
	}
}

module.exports.checkValidity=async function checkValidity(req,res, next){
	let email = req.body.email;
	let user = await User.findOne({email: email})
	if(user){
		console.log(user)
		if(user.status === false){
			req.flash('error_msg', 'Not Authorised')
			res.redirect('/auth/login')
		}else
	return	next();
	}
}
