const Log = require('../models/log');
const User = require('../models/user');
const path = require('path');
const commentsMailer = require('../mailers/comments_mailer');
const qrMailer = require('../mailers/qrcode_mailer');

module.exports.deleteTempVisitor = async function (req, res) {
    // function checks out visitor - logs information

    console.log(req.params);
    try {
        let log  = await Log.findById(req.params.id);

        // let user = await User.findById(log.user._id);
        // user.remove();
        
        log.exitTime = new Date();
        await log.save();
        
        return res.redirect('back');

    } catch(err) {
        console.log("error in delete temp visitor");
        return res.redirect('back');
    }

}

module.exports.createTempVisitor = async function (name, email) {
    
    // error handling prob. by try catch
    let user = await User.findOne({email: email});

    if(!user) {

        // new visitor
        let newUser = await User.create(
        {
            email: email,
            password: "DNE",
            name: name,
            vaccination: 'NA',
            category: 'Visitor'
        });

        return newUser;

    }else {
        // in case visitor visits again
        return user;
    }
}

// module.exports.createTempVisitor = async function (name, email) {
    
//     User.findOne({email: email}, function (err, user) {
//         if(err) {
//             console.log('error in finding user in signing up');
//             return;
//         }
//         let retUser;

//         if(!user) {
//             User.create({
//                 email: email,
//                 password: "DNE",
//                 name: name,
//                 vaccination: 'NA',
//                 category: 'Visitor'

//             }, function (err, user) {

//                 if(err){
//                     console.log('error in creating user (sign up)');
//                     return res.redirect('back')
//                 }

//                 retUser = user;
//                 // return user;
//             });

//             // Important console.log("wow");
//             return retUser;

//         }
        
//     });
// };

module.exports.create = async function (req,res) {

    // already check if entry time exists and user
    // trying to enter again
    try {

        if(req.body.action_reqd == 3) {

            // create new temp user to be deleted on exit)
            let user = await module.exports.createTempVisitor(req.body.name, req.body.email);

            // now visitor can also come again so
            if(user.category != 'Visitor') {
                // if a person with regular account tries to enter
                return res.redirect('back');
            }

            // if(!user) {
            //     return res.redirect('back');
            // }
            
            // create log
            let log = await Log.create({
                user: user,
                temperature: req.body.temperature,
                entryTime: new Date(),
                purpose: req.body.purpose
            });

            // push to records
            user.logs.push(log);
            user.save();

            // send QR code to user
            qrMailer.sendQRMail(log, user);

            return res.redirect('back');
        }

        let user = await User.findOne(req.user._id);

        if(req.body.action_reqd == 0 || req.body.action_reqd == 2) {

            //check in required
            let log = await Log.create({
                user: req.user._id,
                temperature: req.body.temperature,
                entryTime: new Date()
            });
    

            user.logs.push(log);
            await user.save();
            // console.log(user.logs);
        
        }else {
            //check out required
            // add exit time in log
            let log = await Log.findOne(req.user.logs[req.user.logs.length - 1]._id);
            // console.log(log);
            log.exitTime = new Date();
            await log.save();

        }
        return res.redirect('back');

    } catch (error) {
        console.log("Could not create log" + error);
    }

}