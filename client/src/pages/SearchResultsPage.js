import LoginModal from "../components/LoginModal";
import { useState, useEffect } from "react";
import Post from "../components/Post";
import axios from "axios";
import React from 'react';
import classes from "./HomepageStyle.module.css"
import { useLocation } from "react-router-dom";

function SearchResultsPage() {

    // State for managing the number of posts displayed
    const [posts, setPosts] = useState([])

    let location = useLocation();
    // get search query
    let searchQuery = location.state.searchQuery;
    
    // Get the posts each time the sorting order is changed
    useEffect(() => {
        axios.get('http://localhost:4000/search/'+searchQuery)
        .then((response) => {
            setPosts(response.data)
            console.log("RETRIEVED POST: " + JSON.stringify(response.data))
        })
        .catch(err => {
            console.log(err);
        });
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    
    return (
        <div style={{paddingBottom: '10px'}}>
            <LoginModal/>
            {posts.length !== 0 && (
            <h3 className={classes.searchHeader}>
                Search results for: {searchQuery}
            </h3>
            )}
            {posts.length === 0 && (
            <h3 className={classes.searchHeader}>
                No results for: {searchQuery}
            </h3>
            )}
            {posts.map((post,ind) => {
                return <Post key={ind} {...post}/>
            })}
        </div>
    )
}


export default SearchResultsPage;