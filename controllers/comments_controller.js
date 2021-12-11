const Comment = require('../models/comment');
const Post = require('../models/post');
// const commentsMailer = require('../mailers/comments_mailer');
// const commentEmailWorker = require('../workers/comment_email_worker');
// const queue = require('../config/kue');

module.exports.create = async function (req, res) {

    try {
    // for security reasons
        let post = await Post.findById(req.body.post);
        console.log("Comments controller - create");
        // so post could be found or not it won't throw err
        // if not found post we could manually throw error
        // since sending response is essential
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            // add comment id to comments array
            post.comments.push(comment);
            post.save();

            await comment.populate('user','name email').execPopulate();
            
            // commentsMailer.newComment(comment);
            // Delayed Jobs Version
            // let job = queue.create('emails', comment).save(function (err) {
            //     if(err) {
            //         console.log('Error sending to queue', err);
            //         return;
            //     }

            //     console.log('job enqueued', job.id);
            // });

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment added"
                });
            }

            return res.redirect('/');
        } else {
            throw 'unauthorised access!';
        }

    }catch(err) {
        console.log('Error creating comment',err);
        return res.status(401).send('Unauthorised!');
    }
}

module.exports.destroy = async function (req, res) {
    
    try {
        let comment = await Comment.findById(req.params.id);

        // differing here from cn's code
        // second level of protection
        if(comment.user == req.user.id) {
    
            await Post.findByIdAndUpdate(comment.post, { $pull: {comments: req.params.id}});
    
            comment.remove();

            // remove associated likes - on the commment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });   
            }
            return res.redirect('back');
    
        }else {
            return res.redirect('back');
        }
    } catch(err) {
        console.log('Error occured', err);
    }
 

};

/*
module.exports.create = function (req, res) {
    // for security reasons
    Post.findById(req.body.post, function (err, post) {
        
        if(post) {
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment) {
            // handle error

            // add comment id to comments array
                post.comments.push(comment);
                post.save();

                res.redirect('/');

            });

        }

    });
}
*/
/*
module.exports.destroy = function (req, res) {
    Comment.findById(req.params.id, function (err, comment) {

        // differing here from cn's code
        if(comment.user == req.user.id) {

            Post.findByIdAndUpdate(comment.post, { $pull: {comments: req.params.id}}, function (err, post) {
                
                comment.remove();
                return res.redirect('back');
            });
            

        }else {
            return res.redirect('back');
        }
    })

}*/