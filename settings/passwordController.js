const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('../models/user');
const Controller = require('../controller/userAuth')
const crypto = require("crypto");
const MailUtil = require("../config/email/email")
const Sender = require("../config/email/sender")
const SendMail = require("../config/email/sendingMail")
var bcrypt = require('bcryptjs');

/**
 * @param {object} req 
 * @param {object} res  
 */
module.exports.get_method_forgot = function (req, res) {
  res.render('forgot');
}


/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
module.exports.post_method_forgot = async function (req, res, next) {
  try {
    var buffer = await crypto.randomBytes(20);
    var token = buffer.toString('hex');
    var user = await User.findOne({ email: req.body.email })
    if (!user) {
      req.flash('error', 'No account with that email address exists.');
      return res.redirect('/userSetting/forgot');
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1800000; // 15 minutes

    await User.findOneAndUpdate(
      { email: req.body.email },
      { resetPasswordToken: token, resetPasswordExpires: Date.now() + 1800000 }
    )

    var mailOptions = {
      to: user.email,
      from: Sender.MAIL_OPTIONS.FROM,
      subject: MailUtil.reset_pass_mail.subject,
      text: MailUtil.reset_pass_mail.header + MailUtil.reset_pass_mail.middle + 'https://' + req.headers.host + '/userSetting/reset/' + token + '\n\n' + MailUtil.reset_pass_mail.footer
    }

    var flag = await SendMail.sendMail(mailOptions);
    if (flag) {
      console.log('mail sent');
      req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
      res.redirect("/userSetting/forgot")

    }
  }
  catch (error) {
    console.log(error)
    throw error
  }
}


/**
 * @param {object} req 
 * @param {object} res 
*/
module.exports.get_token = async function (req, res) {
  try {
    var user = await User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      })

    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      res.redirect('/userSetting/forgot');
    }
    res.render('reset', { token: req.params.token });
  }
  catch (err) {
    console.log(err)
    return err
  }
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */

module.exports.post_token = async function (req, res, next) {
  try {
    console.log(req.params.token)
    let user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('back');
    }
    if (user) {
      var newpassword;
      if (req.body.password === req.body.confirm) {
        let salt = await bcrypt.genSalt(10);
        if (salt) {
          let hash = await bcrypt.hash(req.body.password, salt);
          newpassword = hash;
        }
        user = await User.findOneAndUpdate(
          { resetPasswordToken: req.params.token },
          { password: newpassword, resetPasswordToken: '', resetPasswordExpires: '' }
        );

        if (user) {
          var mailOptions = {
            to: user.email,
            from: Sender.MAIL_OPTIONS.FROM,
            subject: MailUtil.reset_pass_done.subject,
            text: MailUtil.reset_pass_done.header + MailUtil.reset_pass_done.middle + '\n\n' + MailUtil.reset_pass_done.footer
          };
          var flag = await SendMail.sendMail(mailOptions);
          if (flag) {
            console.log('mail sent');


          }
          req.flash('success_msg', 'Your password has been reset successfully, please login');
          res.redirect('/auth/login');
        }

      } else {
        req.flash("error_msg", "Passwords do not match.");
        return res.redirect('back');
      }
    }
  } catch (error) {
    console.log(error)
    throw error

  }
}
/**
 * @param {object} req 
 * @param {object} res 
*/
module.exports.get_method_changePassword = function (req, res) {
  res.render('reset', { changePassword: true });
}

module.exports.post_method_changePassword = async function (req, res) {
  let user = await User.findById(req._passport.session.user)

  if (user) {
    var oldPassword = req.body.oldpassword
    var password = req.body.password
    var confirm = req.body.confirm
    Controller.comparePassword(oldPassword, user.password, async function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        var newPassword
        if (password === confirm) {
          let salt = await bcrypt.genSalt(10);
          if (salt) {
            let hash = await bcrypt.hash(req.body.password, salt);
            newPassword = hash;
            user = await User.findByIdAndUpdate(user.id, { password: hash });
            if(user){
              res.redirect('/')
            }
           
          }
         
        } else {
          req.flash('error_msg','password donot matched')
          res.redirect("/userSetting/changePassword")
        }
      }
    })
 }
}