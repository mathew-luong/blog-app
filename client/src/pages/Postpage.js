import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import React from 'react';
import ExtendedPost from "../components/ExtendedPost";
import LoginModal from "../components/LoginModal";


function Postpage(props) {

    const [post,setPost] = useState({});

    let location = useLocation();


    useEffect(() => {
        // location.pathname = /posts/id of post
        axios.get("http://localhost:4000"+location.pathname)
        .then(response => {
            setPost(response.data)
            console.log("PP: " + JSON.stringify(response.data))
        })
        .catch(error => {
            console.log(error)
        })
    },[location.pathname]);


    return (
        <div>
            <LoginModal/>
            {post && (
                <ExtendedPost {...post}/>
            )
            }
            {!post && (
                <div>Can't find post</div>
            )}
        </div>
    )

}

export default Postpage;