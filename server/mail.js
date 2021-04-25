const nodemailer = require("nodemailer");

// The information of the gmail account
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "csci3100.mindofcrystal@gmail.com",
        pass: "CSCI3100.MindOfCrystal"
    }
});

// The function to send the email 
function sendEmail(emailAddress, token)
{
    // the information of the receiver
    var mailOptions = {
        from: 'csci3100.mindofcrystal@gmail.com',
        to: emailAddress,
        subject: "Forget Your Mind of Crystal Account Password?",
        html: emailTemplate(token)
    }

    // send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Generate the template of the email content
function emailTemplate(token)
{
    var mailTemp = `<center><h1>This is the email from Mind Of Crystal</h1>\n<h3>Do you forget your password?</h3>\n<a href='localhost/reset/?token=${token}'> click here to reset your password </a></center>`;
    return mailTemp;
}

module.exports = {
    sendEmail
}