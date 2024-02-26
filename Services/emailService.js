const nodemailer = require('nodemailer');
const ApiError =require('../Utils/apiError')
const fs = require('fs');



const sendOTP = async (username, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    // create transport for nodemailer
    const transport = nodemailer.createTransport({
        host: process.env.ADMIN_SMTP_SERVER,
        port: process.env.ADMIN_SMTP_PORT,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASS,
        },
    });
    transport.verify().then(()=> console.log('connected to email server')).catch(()=> console.log("error connecting to email server"))
    const mail_config = {
        from: process.env.ADMIN_MAIL,
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
        const result = await transport.sendMail(mail_config);
        console.log('Email sent successfully', result);
        return otp;
    }catch(err){
        console.log("error sending otp", err);
        return;
    }
    
};



// sending mail to admin on request of withdrawal by client
const sendWithdrawalRequest = async ( email=null,withdrawalObj ) => {
    const transport = nodemailer.createTransport({
        host: process.env.ADMIN_SMTP_SERVER,
        port: process.env.ADMIN_SMTP_PORT,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASS,
        },
    });

    const mail_config = {
        from: process.env.ADMIN_MAIL,
        to: process.env.ADMIN_MAIL ?? email,
        subject: 'Withdrawal Request',
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title> ${process.env.NAME_OF_APP} OTP Email</title>
          </head>
          <body>
            <h2 style="align-text:center; background:fff"> Urgent !!!</h2>
            <h1>Dear Admin a new withdrawal has been initiated with details:</h1>
            <h2>Amount: ${withdrawalObj.amount}</h2>
            <h2>Receiver Email: ${withdrawalObj.receiverEmail}</h2>
            <h2>Receiver Address: ${withdrawalObj.receiverAddress}</h2>
            <h2>Receiver Id: ${withdrawalObj.receiverId}</h2>
          </body>
        </html>
        `
    };
     try {
        const result = await transport.sendMail(mail_config);
        console.log('Email sent successfully', result);
        return result.messageId;
    } catch (err) {
        console.log('Error sending withdrawal data to admin', err);
        return null  // Rethrow the error for the caller to handle
    }
}


//sending mail to admin with deposit details
const sendDepositRequest = (depositObj,file, email=null ) => {
    // Create a transporter using your email service details
    const transporter = nodemailer.createTransport({
        host: process.env.ADMIN_SMTP_SERVER,
        port: process.env.ADMIN_SMTP_PORT,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASS,
        },
    });

    // Define the email message
    const message = {
        from: process.env.ADMIN_MAIL,
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
            <h2>Sender Address: ${depositObj.senderEmail}</h2>
            <h2>Sender Id: ${depositObj.senderId}</h2>
            <h2>transaction:${depositObj.transaction}</h2>
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