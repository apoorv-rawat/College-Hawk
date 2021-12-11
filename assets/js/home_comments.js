{
    // send data to controller via AJAX
    
    let createComment = function () {
        // get all forms which create new comment
        let newCommentsForms = $('.post-comments .new-comment-form');
        

        newCommentsForms.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: '/comments/create',
                data: $(this).serialize(),
                success: function (data) {

                    let newComment = newCommentDom(data.data.comment);
                    let postId = data.data.comment.post;
                    $(`#post-comments-${postId}`).prepend(newComment);

                    //  for newly added post apply class for likes event
                    // get togglelikebutton class inside newPost 
                    new ToggleLike($(' .toggle-like-button', newComment));

                    notyGen(data.message, 'success').show();
    
                    // add event listener - to this newly created comment X
                    deleteComment($(' a', newComment));
                    
                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.statusText);
                }

            });

        });

    };

    // method to create a comment in DOM 
    let newCommentDom = function (comment) {
        return $(
            `<li id="comment-${comment._id}">
                <p>
            
                        <small>
                            <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                        </small>
                        
                    <b>${comment.content}</b>
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>

                    <small>
                        <a class="toggle-like-button" data-likes="0" 
                        href="/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                        </a>
                    </small>

                </p>
            </li>`);
    };

    // method to delete a post from dom
    let deleteComment = function (deleteLink) {

        // $(deleteLink required?)
        deleteLink.click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    // removes the comment
                    $(`#comment-${data.data.comment_id}`).remove();

                    notyGen(data.message, 'success').show();
                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.responseText);
                }
            });
        });
    };

    // to put event listeners for ajax delete comment
    let allCommentsLinkTags =  $('#posts-list-container .post-comments-list a.delete-comment-button');
    
    allCommentsLinkTags.each( (index, value) => {
        deleteComment($(allCommentsLinkTags.get(index)));
    });


    createComment();

    // scope create Comments scope to global
    // since when we add new comment we need to attach event listener
    // for comment as well
    var globe = {};
    globe.createCommentFn = createComment;
}

// noty generator
let notyGen = function (text, type) {
    return new Noty({
        theme: 'relax',
        text: text,
        type: type,
        layout: 'topRight',
        timeout: 1500
    });
}