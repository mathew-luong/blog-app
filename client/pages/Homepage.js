import LoginModal from "../components/LoginModal";
import NewPost from "../components/NewPost";
import { useState, useEffect } from "react";
import Post from "../components/Post";
import axios from "axios";
import React from 'react';
import classes from "./HomepageStyle.module.css"

function Homepage() {

    // State for managing the number of posts displayed
    const [posts, setPosts] = useState([])

    // State for managing the sort order (oldest or newest)
    const [sortNewest, setSortNewest] = useState(true)

    // const searchContext = useContext(SearchContext)
    
    // Get the posts each time the sorting order is changed
    useEffect(() => {
        // Get each post on render
        if(sortNewest) {
            axios.get('http://localhost:4000/posts', {withCredentials: true})
            .then((response) => {
                setPosts(response.data)
                // console.log("RETRIEVED POST: " + JSON.stringify(response.data))
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            // sort posts by oldest first
            axios.get('http://localhost:4000/posts', {withCredentials: true})
            .then((response) => {
                const resPosts = response.data
                setPosts(resPosts.reverse())
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [sortNewest]); // eslint-disable-line react-hooks/exhaustive-deps
    // }, [sortNewest,searchContext.searched]); // eslint-disable-line react-hooks/exhaustive-deps


    function sortPostsByOldest() {
        setSortNewest(!sortNewest);
    }
    
    return (
        <div style={{paddingBottom: '10px'}}>
            <LoginModal/>
            <div className={classes.buttonsContainer}>
                <NewPost/>
                <button className={classes.sortBtn} onClick={sortPostsByOldest}>
                    {sortNewest ? 'Sort by oldest' : 'Sort by newest'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                </button>
            </div>
            {posts.map((post,ind) => {
                return <Post key={ind} {...post}/>
            })}
        </div>
    )
}


export default Homepage;