const nodemailer = require('nodemailer');
const fs = require('fs');



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
    try{
        transport.sendMail(mail_config, (err, result) =>{
            if (err){
                console.log("error sending otp", err);
                return;
            }
            console.log('Email sent successfully', result.response);
            
        });
        return otp;
    }catch(err){
        console.log("error sending otp", err);
        return;
    }
    
};



// sending mail to admin on request of withdrawal by client
const sendWithdrawalRequest = ( email=null,withdrawalObj ) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASS,
        },
    });

    const mail_config = {
        from: process.env.MY_EMAIL,
        to: process.env.ADMIN_MAIL ?? email,
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
    try{
        transport.sendMail(mail_config, (err, result) =>{
            if (err){
                console.log("error sending withdrawal data to admin", err);
                return;
            }
            console.log('Email sent successfully', result.response);
            //return result
        });
        return (withdrawalObj);
    }catch(err){
        console.log("error sending withdrawal data to admin", err);
        return;
    }
}


//sending mail to admin with deposit details
const sendDepositRequest = (depositObj,file, email=null ) => {
    // Create a transporter using your email service details
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASS,
        },
    });

    // Define the email message
    const message = {
        from: process.env.MY_EMAIL,
        to: process.env.ADMIN_MAIL || email, // Use || to provide a fallback email
        subject: 'Deposit Request',
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title>${process.env.NAME_OF_APP} OTP Email</title>
          </head>
          <body>
            <h2 style="align-text:center; background:fff"> Urgent!!!! </h2>
            <h1>Dear Admin, a new Deposit has been initiated with details:</h1>
            <h2>Amount: ${depositObj.amount}</h2>
            <h2>Sender Address: ${depositObj.senderAddress}</h2>
            <h2>Sender Id: ${depositObj.senderId}</h2>
          </body>
        </html>
        `,
        attachments: [
            {
                filename: file.filename,
                path: file.path,
                cid: file.filename,
            },
        ],
    };

    // Send the email
    try{
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.error(err);
                // Handle the error if needed
            } else {
                console.log('Email sent: ' + info.response);
                // You can also handle success if needed
            }
        });
        return (depositObj);
    }catch(err){
        console.log("error sending deposit data to admin", err);
        return;
    }
}

const emailService = {
    sendOTP,
    sendWithdrawalRequest,
    sendDepositRequest
}

module.exports = emailService;