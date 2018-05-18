const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('../models/user');
const authController = require('../controller/userAuth')
const Ticket=require('../models/ticket')


/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.getHomePage = async function (req, res) {
    try {
        let currentUser = await User.findById(req._passport.session.user);
       let ticketList=await Ticket.aggregate([
           {
               $lookup:{
                   from:"users",
                   localField:"createdby",
                   foreignField:"_id",
                   as:"user_document"
               }
            }
        //    },
        //    {
        //        $unwind : "$user_document"
        //    }
       ])
       console.log(ticketList)
        console.log(currentUser)
        if (currentUser) {
            res.render('homeUser', { user: currentUser,list:ticketList });
        }

    } catch (err) {
        res.send('something went wrong' + err)
    }
}