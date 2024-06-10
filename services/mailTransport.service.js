const nodemailer = require('nodemailer');
require('dotenv').config();

function mailService(to, subject, text, html, attachmentBuffer, attachmentName) {

    return new Promise((resolve, reject) => {
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let attachmentsDetails = [];
        if (attachmentBuffer && attachmentName) {
            attachmentsDetails.push({
                filename: attachmentName,
                content: attachmentBuffer
            })
        }
    
        let mailDetails = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachmentsDetails
        }
    
        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                console.log("error occurred", err.message);
                reject();
            } else {
                console.log("email sent successfully");
                console.log(data);
                resolve();
            }
        })    
    })
    
}

module.exports = mailService;