const nodemailer = require('nodemailer');



const sendOTP = (username, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    // create transport for nodemailer
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASS,
        },
    });

    const mail_config = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: `${process.env.NAME_OF_APP} password RESET OTP`,
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title> ${process.env.NAME_OF_APP} OTP Email</title>
          </head>
          <body>
            <h2 style="align-text:center; background:fff"> here is your otp. Do not share this code</h2>
            <h1>Dear ${username} Your OTP is: ${otp}</h1>
          </body>
        </html>
        `
    };
    transport.sendMail(mail_config, (err, result) =>{
        if (err){
            console.log("error sending otp", err);
            return;
        }
        console.log('Email sent successfully', result.response);
        //return result
    });
    return (otp);
};

const emailService = {
    sendOTP,
}

module.exports = emailService;