import classes from './NewPostStyle.module.css';
import { useContext, useState } from "react";
import UserContext from '../context/UserContext';
import React from 'react';
import axios from 'axios';
import ClickOutHandler from 'react-clickout-handler';



function NewPost() {

    // State for if the new post modal is open
    const [newPostExpanded, setNewPostExpanded] = useState(false);
    // State for the input fields
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [postImg, setPostImg] = useState("");

    const userContext = useContext(UserContext);

    // visibility of modal shadow 
    let visibility = newPostExpanded ? {display: 'flex'} : {display: 'none'};


    const handlePostClick = () => {
        return setNewPostExpanded(!newPostExpanded);
    };

    function submitPost(e) {
        // Define post header, since we are sending an image
        const headers = {
            'content-type': 'multipart/form-data',
            withCredentials: true
        }
        const data = {
            title: postTitle,
            author: userContext.username,
            body: postBody,
            postedDate: new Date(),
            likes: {},
            dislikes: 0,
            image: postImg[0],
            comments: []
        }
        axios.post('http://localhost:4000/newpost',data,{headers})
        .then((res) => {
            handleClickOut();
        })
        .catch((err) => {

        })
    }

    //  When a user clicks outside the modal, close the modal
    function handleClickOut() {
        // Only handle click out if the modal is visible
        if(newPostExpanded) {
            setPostTitle("");
            setPostBody("");
            setPostImg("");
            setNewPostExpanded(false);
        }
    }

    // If the modal is visible, don't allow scrolling
    if(newPostExpanded) {
        document.body.style.overflow = 'hidden';
    }
    else {
        document.body.style.overflow = 'unset';
    }

    return (
        <>
        {/* Only display the "Create a new post button" if a user is logged in */}
        {userContext.username && (
        <div className={classes.newPostBtnContainer}>
            <button type='button' onClick={handlePostClick} className={classes.container}>
                Create a new post
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
        )}
        {/* User is not logged in, display message */}
        {!userContext.username && (
            <h3 className={classes.loginHeader}>Log in to create a post.</h3>
        )}
        {/* Open form modal when user clicks 'create a new post' button */}
        <div className={classes.modalShadow} style={visibility}>
            <ClickOutHandler onClickOut={handleClickOut}>
                <form className={classes.newPostForm} onSubmit={submitPost}>
                    <h3 className={classes.formHeader}>Create a new post</h3>
                    <input required placeholder="Title (Text required)" className={classes.formTitle} value={postTitle} onChange={e => setPostTitle(e.target.value)}/>
                    <textarea required placeholder="Body (Text required)" className={classes.formBody} value={postBody} onChange={e => setPostBody(e.target.value)}></textarea>
                    <div className={classes.imgContainer}>
                        <label className={classes.imgLabel} htmlFor="img">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Add an image
                        </label>
                        <input className={classes.imgInput} type="file" title="Add an image" id="img" name="image" onChange={e => setPostImg(e.target.files)}/>
                    </div>
                    <div className={classes.formButtons}>
                        <button className={classes.closeFormBtn} type="button" onClick={handleClickOut}>Cancel</button>
                        <button className={classes.btns}>Create Post</button>
                    </div>
                </form>
            </ClickOutHandler>
        </div>
        </>
    )
}

export default NewPost;
