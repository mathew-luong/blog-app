import classes from './PostStyle.module.css';
import React, { useState, useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import UserContext from '../context/UserContext';
import axios from 'axios';


function Post(props) {

    // Context for logged in user
    const userContext = useContext(UserContext);

    const [postExpanded, setPostExpanded] = useState(false);
    const [postLikes, setPostLikes] = useState(null);

    
    // useEffect(() => {
    //     console.log("JUST UPDATED DIS B" + props._id)
    //     if(props.likes) {
    //         setPostLikes(Object.keys(props.likes).length)
    //     }
    //     if(props._id) {
    //         axios.get("http://localhost:4000/posts/"+props._id)
    //         .then(response => {
    //             setPostLikes(Object.keys(response.data.likes).length)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    //     }

    // },[postLikes])


    // Convert post date into a "time ago" format
    let timeago = moment(props.postedDate).fromNow();

    let imagePath = "";
    // If this post has an image, find the path of the image
    if(props.image) {
        // Fetch image from database
        imagePath = 'http://localhost:4000/'+props.image;
    }

    // Handle styling changes when viewport width is 480px or below
    const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

    // Handle styling changes when viewport width is 768px or below
    const smallScreen = useMediaQuery({ query: `(max-width: 768px)` });

    // Check if this user has liked the post: Likes = {"userId": true} if userId has liked this post
    let isLiked = Boolean(props.likes[userContext._id]);
    // Retrieve the number of likes this post has
    let numLikes = Object.keys(props.likes).length

    function handlePostClick() {
        return setPostExpanded(!postExpanded);
    };

    function handleCommentBtnClick(event) {
        event.stopPropagation();
    }

    function handleLikeBtn(event) {
        event.stopPropagation()
        const data = {
            id: userContext._id
        }
        axios.patch('http://localhost:4000/like/'+props._id, data, {withCredentials:true})
        .then(response => {
            // console.log("LIKES " + Object.keys(response.data.likes).length)
            setPostLikes(Object.keys(response.data.likes).length)
            isLiked = Boolean(response.data.likes[userContext._id]);
        })
        .catch(error => {
            console.log("New post error: " + error);
        })
    }

    return (
        <div id="1" className={classes.container} onClick={handlePostClick}>
            <div className={classes.postContent}>
                {/* If there is an image and viewport width is < 480px, set the header margin (for styling posts with no images or with images) */}
                <div className={classes.postHeader} style={{marginTop: (isMobile && props.image) ? '155px' : '0px'}}>
                    <span className={classes.postAuthor}>Posted by <span style={{fontWeight: 'bold'}}>{props.author}</span></span>
                    <span className={classes.postDate}>{timeago}</span>
                </div>
                <div className={classes.titleContainer}>
                    <h2 className={classes.postTitle} style={smallScreen && !isMobile ? {width: props.image ? '65%' : '100%' } : {width: props.image ? '75%' : '100%' }}>
                        {props.title}
                    </h2>
                    {postExpanded && (
                        <p className={classes.postBody} style={smallScreen && !isMobile ? {width: props.image ? '65%' : '100%' } : {width: props.image ? '75%' : '100%' }}>
                            {props.body}
                        </p>
                    )}
                </div>
                <div className={classes.postButtons}>
                    {/* Only allow logged in users to like posts */}
                    {userContext.username && (
                    <button className={isLiked ? classes.isLiked : classes.btns} onClick={(e) => {handleLikeBtn(e)}}>
                        <span className={classes.btnText}>{numLikes}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                    )}
                    <Link to={"/posts/" + props._id} style={{ textDecoration: 'none' }}>
                        <button className={classes.btns} onClick={handleCommentBtnClick}>
                            <span>{props.comments.length} comments</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
            
            {/* Image is only displayed if the post has an image */}
            <div className={classes.imageContainer} style={{display: props.image ? 'block' : 'none' }}>
                <img className={classes.postImg} alt="PostImage" src={imagePath}></img>
            </div>
      </div>
    )
}

export default Post;