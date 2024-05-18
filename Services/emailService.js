const nodemailer = require('nodemailer');
const ApiError =require('../Utils/apiError')
const fs = require('fs');


const welcomeMail = async (username, email) => {
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
        subject: `${process.env.NAME_OF_APP} Welcome Mail`,
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <style>
            body {
              padding: 0;
              margin: 0;
              background-color: rgb(30, 33, 37);
              padding: 0 4px;
            }
            .header {
              background-color: rgb(37, 41, 46);
              height: 100px;
              width: 100%;
              display: flex;
              align-items: center;
              text-align: center;
              justify-content: center;
        
            }
            .header img{
              width: 70px;
              height: 70px;
            }
            .container {
              width: 100vw;
              height: 100vh;
              background-color: rgb(30, 33, 37);
              padding: 0 2%;
              font-family: Arial, Helvetica, sans-serif;
              max-width: 400px;
              margin: 0 auto;
            }
        
            .container h3 {
              color: rgb(255, 255, 255);
              font-family: Arial, Helvetica, sans-serif;
              font-size: 15px;
            }
        
            .container p {
              color: rgb(160, 158, 158);
              font-family: Arial, Helvetica, sans-serif;
              font-size: 13px;
            }
            .whiter {
              color: rgb(206, 206, 206) !important;
            }
          </style>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://broker-site.onrender.com/public/images/Logo.png" alt="${process.env.NAME_OF_APP}" />
              </div>
              <h3>Hurray!! ${username},</h3>
              <p>
                We are really excited to welcome you to ${process.env.NAME_OF_APP} community. This
                is just the beginning of greater things to come.
              </p>
        
              <p>Here is how you can get the most out of our system.</p>
        
              <p class="whiter">
                Make a Deposit, Buy an Investment Plan and sit back to enjoy while we
                make your money work for you.
              </p>
              <p>We look forward to seeing you gain your financial desires.</p>
              <p>Your experience is going to be nice and smooth.</p>
        
              <p>No frustrations, no trouble.</p>
              <br />
              <p>
                Thanks, and welcome. <br />
                ${process.env.NAME_OF_APP} © 2024 Trading. All rights reserved.
              </p>
            </div>
          </body>
        </html>        
        `
    };

    try{
        const result = await transport.sendMail(mail_config);
        console.log('Email sent successfully', result);
        return result.messageId;
    }catch(err){
        console.log("error sending otp", err);
        return;
    }
    
};

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
            <title> ${process.env.NAME_OF_APP} Withdrawal Request Email</title>
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
            <h2>Sender Mail: ${depositObj.senderEmail}</h2>
            <h2>Sender Id: ${depositObj.userId}</h2>
            <h2>transaction:${depositObj.ref}</h2>
            <h2>transaction id:${depositObj.transactionId}</h2>
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
    welcomeMail,
    sendOTP,
    sendWithdrawalRequest,
    sendDepositRequest
}

module.exports = emailService;