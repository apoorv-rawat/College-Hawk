const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {

    try {
    // console.log("home_ctrl",res.locals.flash);

    let statusString = "";
    let codeMap = {
        '0' : "Check in",
        '1' : "Check out",
        '2' : "Check in",
    }
    let statusCode = -1;

    if(req.user) {
        let userData = await User.findById(req.user._id)
        .populate('logs');

        // console.log(userData);
        logs = userData.logs;

        if(logs.length == 0) {
            // no log record yet
            statusString = "No previous data data found!";
            statusCode = 0;
        }else {

            let lastLog = logs[logs.length - 1];
            if(!lastLog.exitTime) {
                // display entry time  
                statusString = "Your last entry time was " + lastLog.entryTime.toLocaleTimeString() + " on " + lastLog.entryTime.toDateString();
                statusCode = 1;
            }else {
                // new log to be created display old entry and exit time
                statusString = "Your last exit time was " + lastLog.exitTime.toDateString() + " at " + lastLog.exitTime.toLocaleTimeString();
                statusCode = 2;
            }
        }

    }

    let posts = await Post.find({})
    // sort the result acc to created at time
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        // populate user and likes array of posts
        populate: {
            path: 'user'
        },
        populate: {
            path: 'likes'
        }
    })
    // populate likes on the post
    .populate('likes');

    let users = await User.find({});

    return res.render('home', {
        title: "Hawk | Home",
        posts: posts,
        all_users: users,
        statusString: statusString,
        statusCode: statusCode,
        codeMap: codeMap
    });

    }catch(err) {
        console.log('Error', err);
    }
    
}

/*module.exports.home = function (req, res) {
    console.log(req.cookies);
    // res.cookie('roll',99);

    // populatev(replace id by actual data) the user for each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function (err, posts) {

        User.find({}, function (err, users) {

            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        });
        // locals from res.locals is being passed to render
        
    });
    
}
// functions are called actions
*/