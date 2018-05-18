const express = require('express');
const router = express.Router();
const PasswordController = require('../settings/passwordController')
const Authentication = require('../config/passport');
const superController = require('../controller/superAdmin');
const UserAuth = require('../controller/userAuth');
const middleware=require('../middleware/index')



router.get('/homeSuperAdmin',middleware.ensureAuthenticated,superController.getHomePage);

router.post('/invite', superController.invite );

router.post('/changeStatus', UserAuth.changeStatus)

router.post('/re-invite', superController.reInvite);

router.get('/delete-user/:id', superController.deleteUSer);





  module.exports = router;

// router.get('/passworden/:email/:password/:role', async function(req, res){
//   console.log('working')
//  var pass = req.params.password;
//  var emaila = req.params.email;
//  var rolea = req.params.role;
//  var salt = await bcrypt.genSalt(10)
// 						var hash = await bcrypt.hash(pass, salt)
// 						if(hash){
// 							var userObj = new userModel({
//                 email: emaila,
//                 password:hash,
//                 role: rolea,
//                 status : true

//               })
//             var user= await userObj.save();
//             if(user)
//             res.json(user);
//             else
//             res.send('something wrong')
//             }
// })