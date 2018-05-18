var nodemailer = require("nodemailer");
var config = require('./sender');


var transporter = nodemailer.createTransport({
    service: config.TRANSPORTER.SERVICE,
    auth: {
        user: config.TRANSPORTER.AUTH.USER,
        pass: config.TRANSPORTER.AUTH.PASS,
    }
});

var mailOptions = {
    from: config.TRANSPORTER.AUTH.USER,
}

module.exports.sendMail = async function (mailObj) {
    try {
        mailOptions.to = mailObj.to
        mailOptions.subject = mailObj.subject
        mailOptions.text = mailObj.body

        var info = await transporter.sendMail(mailOptions);
        if (info) {
            console.log("Email sent : " + info.response);
            return info;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}