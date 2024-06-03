const nodemailer = require('nodemailer');

function mailService(to, subject, text, csvFilePath, csvFileName) {

    return new Promise((resolve, reject) => {
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "pateljil8244@gmail.com",
                pass: "vgyl rjof dazn sfdh"
            }
        });
    
        let mailDetails = {
            from: "pateljil8244@gmail.com",
            to: to,
            subject: subject,
            text: text,
            attachments: [
                {
                    filename: csvFileName,
                    path: csvFilePath
                }
            ]
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