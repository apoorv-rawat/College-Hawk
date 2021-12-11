const nodeMailer = require('../config/nodemailer');

exports.sendQRMail = (log, user) => {
    let htmlToSend = nodeMailer.renderTemplate(
    {
        log: log,
        user: user
    }, 
    '/qr/new_qr.ejs');

    nodeMailer.transporter.sendMail({
        // to: "apoorvrawat@rocketmail.com",
        to: user.email,
        subject: 'Hey! This is your QR code',
        html: htmlToSend
    },
    (err,info) => {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Mail delivered', info);
        return;
    });
    
}