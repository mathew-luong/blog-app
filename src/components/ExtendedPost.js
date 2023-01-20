import classes from './ExtendedPostStyle.module.css';
import React from 'react';
import moment from 'moment';
import UserContext from '../context/UserContext';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';


function ExtendedPost(props) {

    // Context for logged in user
    const userContext = useContext(UserContext);
    const [newComment, setNewComment] = useState('');

    let timeago = moment(props.postedDate).fromNow();

    let comments = props.comments;

    let location = useLocation();
    const navigate = useNavigate();

    let imagePath = "";
    if(props.image) {
        // Fetch image from database
        imagePath = 'http://localhost:4000/'+props.image;
    }

    const deletePost = () => {
        axios.delete('http://localhost:4000/delete' + location.pathname)
        .then(() => {
            // redirect user to homepage
            navigate('/');
        })
        .catch((err) => {
            console.log("ERROR")
        })

    }

    const handleNewComment = (e) => {
        const data = {
            author: userContext.username,
            text: newComment,
            datePosted: new Date()
        }
        axios.patch('http://localhost:4000/newcomment/'+props._id, data, {withCredentials: true}) 
        .then((response) => {
            // reset input value
            setNewComment('')
        });
    }

    return (
        <div>
            <div className={classes.container}>
                {/* Display a delete post button if the logged in user is the author of the post */}
                {userContext.username === props.author && (
                    <button className={classes.deleteBtn} onClick={deletePost}>
                        Delete 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                )}
                <div className={classes.postInfo}>
                    <span className={classes.postAuthor}>Posted by {props.author}</span>
                    <span className={classes.postDate}>{timeago}</span>
                </div>
                {/* Only display an image if the post has an image, otherwise just display the title and body */}
                <div className={classes.imageContainer} style={{display: props.image ? 'block' : 'none' }}>
                    <img className={classes.postImg} alt="PostImage" src={imagePath}></img>
                </div>
                <h3 className={classes.postTitle}>{props.title}</h3>
                <p className={classes.postBody}>{props.body}</p>
                <div className={classes.commentContainer}>
                    <h4 className={classes.commentsHeader}>Comments</h4>
                    {/* If a user is logged in, allow them to post a new comment */}
                    {userContext.username && (
                        <form className={classes.postCommentContainer}>
                            <span className={classes.newCommentHeader}>Add a comment</span>
                            <textarea required placeholder="Share your thoughts..." className={classes.newCommentInput} value={newComment} onChange={(e) => {setNewComment(e.target.value)}}></textarea>
                            <button className={classes.newCommentBtn} onClick={handleNewComment}>Post</button>
                        </form>
                    )}
                    {!userContext.username && (
                        <h4 className={classes.logInHeader}>Log in to post a comment.</h4>
                    )}
                    {comments && comments.reverse().map((comment,ind) => {
                        return (
                            <Comment {...comment} key={ind}/>
                        )
                    }).reverse()
                    }
                    {!comments && 
                        <div>
                        No comments
                        </div>}
                    <div>

                    </div>
                </div>
            </div>
        </div>

    )
}


export default ExtendedPost;