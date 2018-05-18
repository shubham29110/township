const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware=require('../middleware/index')

// Get Homepage

router.get('/', middleware.ensureAuthenticated,middleware.checkBuilding,async function (req, res) {
	var user = await User.findById(req._passport.session.user);
	if(user){
		if(user.role === 'superAdmin'){
			res.redirect('/superAdmin/homeSuperAdmin');
		}
		if(user.role === 'admin'){
			res.redirect('/admin/homeAdmin')
		}
		if(user.role === 'user'){
			res.redirect('/tenant/homeUser')
		}
	}
});



module.exports = router;