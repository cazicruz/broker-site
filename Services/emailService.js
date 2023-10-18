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



// sending mail to admin on request of withdrawal by client
const sendWithdrawalRequest = ( email,withdrawalObj ) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASS,
        },
    });

    const mail_config = {
        from: process.env.MY_EMAIL,
        to: process.env.ADMIN_MAIL,
        subject: `${process.env.NAME_OF_APP} password RESET OTP`,
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title> ${process.env.NAME_OF_APP} OTP Email</title>
          </head>
          <body>
            <h2 style="align-text:center; background:fff"> here is your otp. Do not share this code</h2>
            <h1>Dear Admin a new withdrawal has been initiated with details:</h1>
            <h2>Amount: ${withdrawalObj.amount}</h2>
            <h2>Receiver Address: ${withdrawalObj.receiverAddress}</h2>
            <h2>Receiver Id: ${withdrawalObj.receiverId}</h2>
          </body>
        </html>
        `
    };
    transport.sendMail(mail_config, (err, result) =>{
        if (err){
            console.log("error sending withdrawal data to admin", err);
            return;
        }
        console.log('Email sent successfully', result.response);
        //return result
    });
    return (withdrawalObj);
}

const emailService = {
    sendOTP,
    sendWithdrawalRequest,
}

module.exports = emailService;