import Header from "./components/Header";
import LoginModalContext from "./context/LoginModalContext";
import UserContext from "./context/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Postpage from "./pages/Postpage";
import React from 'react';
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {

    // State for managing if the login/signup modal is open
    const [showLoginModal, setShowLoginModal] = useState(false);

    // State for managing if a user is logged in
    const [userLoggedIn, setUserLoggedIn] = useState({});

    axios.defaults.withCredentials = true;


    useEffect(() => {
        // Gets the user each time the app renders
        // No effect if no user is logged in
        axios.get('http://localhost:4000/user', {withCredentials: true})
        .then((response) => {
            // Set the user to logged in 
            setUserLoggedIn(response.data)
        })
        .catch(err => {
            console.log("APP ERR: " + err);
        });
    
    }, []);

    function logOut() {
        axios.post('http://localhost:4000/logout', {withCredentials: true})
        .then(() => {
            setUserLoggedIn({})
        });
    }

    return (
        <div style={{backgroundColor: '#F0F0F0'}}>
            {/* Login modal by default is non visible, changed with passed setVisible function */}
            <LoginModalContext.Provider value={{visible: showLoginModal, setVisible: setShowLoginModal}}>
                {/* Context for if a user is logged in */}
                <UserContext.Provider value={{...userLoggedIn,logOut, setUserLoggedIn}}>
                    <Router>
                        <Header/>
                        <Routes>
                            {/* Homepage displays all the posts */}
                            <Route exact path="/" element={<Homepage/>}/>
                            <Route exact path="/posts/:id" element={<Postpage/>}/>
                            <Route exact path="/search/:id" element={<SearchResultsPage/>}/>
                        </Routes>
                    </Router>
                </UserContext.Provider>
            </LoginModalContext.Provider>
        </div>
    );
}

export default App;
