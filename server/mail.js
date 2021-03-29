module.exports = {
    sendEmail
}

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "csci3100.mindofcrystal@gmail.com",
        pass: "CSCI3100.MindOfCrystal"
    }
});

function sendEmail(emailAddress, token)
{
    var mailOptions = {
        from: 'csci3100.mindofcrystal@gmail.com',
        to: emailAddress,
        subject: "Forget Your Mind of Crystal Account Password?",
        html: emailTemplate(token)
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function emailTemplate(token)
{
    var mailTemp = `<center><h1>This is the email from Mind Of Crystal</h1>\n<h3>Do you forget your password?</h3>\n<a href='localhost/reset/?token=${token}'> click here to reset your password </a></center>`;
    return mailTemp;
}