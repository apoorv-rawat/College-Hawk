const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside new comment mailer');

    // /views/mailers already set in function
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        // from: 'apoorvrawatindia@gmail.com',
        // from: 'Codeial Admin',
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    },
    (err, info) => {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Mail delivered', info);
        return;
    })
}