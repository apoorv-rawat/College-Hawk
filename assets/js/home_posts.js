{
    // sends data to controller
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();
            
            $.ajax({
                type: 'POST',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
            
                    let newPost= newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);

                    // add event listener for comment
                    globe.createCommentFn();

                    //  for newly added post apply class for likes event
                    // get togglelikebutton class inside newPost 
                    new ToggleLike($(' .toggle-like-button', newPost));
                    

                    notyGen(data.message, 'success').show();

                    //add event listener for deleting post (X)  -for post created via ajax
                    // console.log('Adding delete button to this element',$(' .delete-post-button', newPost));
                    deletePost($(' .delete-post-button', newPost)); 

                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.statusText);
                }                 
            });
        });
    }

    // method to create a post in DOM
    let newPostDom = function (post) {
        // to convert html to jquery object
        return $(`<li id="post-${post._id}">
                    <p>
                        
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                        </small>
                        
                
                        ${post.content} ${post.user.name} 
                    
                        <br>
                        <small>
                                <a class="toggle-like-button" data-likes= "0" 
                                    href="/likes/toggle/?id=${post._id}&type=Post">0 Likes
                                </a>
                        </small>
                
                    <div class="post-comments">
                
                            <form action="/comments/create" class="new-comment-form" method="POST">
                                <input type="text" name="content" placeholder="Type a comment..." required>
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="Add comment">
                            </form>
                        
                    
                    </div>
                
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                            
                        </ul>
                
                    </div>
                
                    </p>
                
                </li>`)
    };

    // method to delete a post from dom
    let deletePost = function (deleteLink) {

        // $(deleteLink required?)
        deleteLink.click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    // removes the post
                    $(`#post-${data.data.post_id}`).remove();

                    notyGen(data.message, 'success').show();
                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.responseText);
                }
            });
        });
    };


    // to put event listeners for ajax delete
    let allPostsLinkTags =  $('#posts-list-container a.delete-post-button');
    allPostsLinkTags.each( (index, value) => {
        deletePost($(allPostsLinkTags.get(index)));
    });

    createPost();
}