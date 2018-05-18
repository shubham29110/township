const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('../models/user');
const authController = require('../controller/userAuth')
const MailUtil = require('../config/email/email.json')
const Sender = require("../config/email/sender")
const SendMail = require("../config/email/sendingMail")
const crypto = require('crypto')

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.get_homePage = async function (req, res) {
    try {
        let currentUser = await User.findById(req._passport.session.user);
        let userList = await User.find({ role: 'user' });
        console.log(userList);
        if (userList) {
            res.render('homeAdmin', { user: currentUser, userList: userList });
        }
    } catch (error) {
        res.send('something went wrong' + '  ' + error)
    }

}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.invite = async function (req, res) {
    try {
        var buffer = await crypto.randomBytes(20);
        var usertoken = buffer.toString('hex');

        var userEmail = req.body.email;
        var userName = req.body.name;
        var mailOptions = {
            to: userEmail,
            from: Sender.MAIL_OPTIONS.FROM,
            subject: MailUtil.invitation_mail.subject,
            body: MailUtil.invitation_mail.header + MailUtil.invitation_mail.middle +
                'https://' + req.headers.host + '/users/invitation/' + usertoken + '\n\n' +
                MailUtil.invitation_mail.footer
        };
        var flag = await SendMail.sendMail(mailOptions);
        if (flag) {
            console.log('mail sent');
            var newUser = new User({
                email: userEmail,
                name: userName,
                role: 'user',
                status: false,
                token: usertoken,
                createdby : req._passport.session.user
            });
            let user = await newUser.save();
            if (user) {
                req.flash('success_msg', 'An e-mail has been sent to ' + userEmail + ' with further instructions.');
                res.redirect("/admin/homeAdmin")

            }
        }
    } catch (err) {
        res.send('Something went wrong' + err)
    }
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
module.exports.reInvite = async function (req, res) {
    try {
        var buffer = await crypto.randomBytes(20);
        var usertoken = buffer.toString('hex');

        var userEmail = req.body.email;
        var userName = req.body.name;
        var userId = req.body.id;
        var mailOptions = {
            to: userEmail,
            from: Sender.MAIL_OPTIONS.FROM,
            subject: MailUtil.invitation_mail.subject,
            body: MailUtil.invitation_mail.header + MailUtil.invitation_mail.middle +
                'https://' + req.headers.host + 'users/invitation/' + usertoken + '\n\n' +
                MailUtil.invitation_mail.footer
        };
        var flag = await SendMail.sendMail(mailOptions);
        if (flag) {
            console.log('mail sent');
            let user = await User.findOneAndUpdate({ _id: userId }, { email: userEmail, name: userName });

            if (user) {
                res.json({ 'message': 'Re-invitation mail has been sent to user.' });
                console.log('----------RE-INVITE----------------')
            }
        }
    } catch (err) {
        res.send('Something went wrong' + err)

    }
}

