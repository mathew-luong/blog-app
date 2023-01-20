import classes from './LoginModalStyle.module.css';
import { useState, useContext } from "react";
import axios from 'axios';
import LoginModalContext from '../context/LoginModalContext';
import ClickOutHandler from 'react-clickout-handler';
import logo from '../image/logo.png'
import UserContext from "../context/UserContext";
import React from 'react';


function LoginModal(props) {

    // State to handle whether the modal is for login or signup
    const [signupOpen, setSignupOpen] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // Context for whether the modal is visible or not
    const modalContext = useContext(LoginModalContext);
    // Context for logged in user
    const userContext = useContext(UserContext);

    // Modal visibility based on the modalContext (default is invisible) 
    let visibility = modalContext.visible ? {display: 'flex'} : {display: 'none'};

    // Handler for when user switches between login and register 
    const handleModeBtn = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        return setSignupOpen(!signupOpen);
    };


    // Creates a new user with email, username, password
    function handleRegisterBtn(e) {
        e.preventDefault();
        // Data from inputs used to create new user
        const data = {email, username, password};
        // db serve runs on port 4000, endpoint is /signup
        // Sends a cookie (withCredentials)
        axios.post('http://localhost:4000/signup', data, {withCredentials: true})
        .then((res) => {
            // Server sends cookie if succesful
            // Update the logged in user with the registered username
            userContext.setUserLoggedIn({username});
            // Dismiss the register modal
            modalContext.setVisible(false);
            // Reset the modal back to login (since it is the default)
            setSignupOpen(false);
            setEmail('');
            setPassword('');
            setUsername('');
        })
        .catch(err => {
            console.log(err);
        });
    }

    function handleLoginBtn(e) {
        e.preventDefault();
        const data = {username, password};
        axios.post('http://localhost:4000/login', data, {withCredentials: true})
        .then((res) => {
            // Set user to be logged in
            userContext.setUserLoggedIn({username});
            // Dismiss the login modal
            modalContext.setVisible(false);
            setUsername('');
            setPassword('');
        })
        .catch((err) => {
            if(err.response.status === 401) {
                // Invalid username or password
                alert(err.response.data);
                setUsername('');
                setPassword('');
            }
        })
    }

    //  When a user clicks outside the modal, close the modal
    function handleClickOut() {
        // Only handle click out if the modal is visible
        if(modalContext.visible) {
            setUsername('');
            setPassword('');
            setEmail('');
            modalContext.setVisible(false);
        }
    }

    // If the modal is visible, don't allow scrolling
    if(modalContext.visible) {
        document.body.style.overflow = 'hidden';
    }
    else {
        document.body.style.overflow = 'unset';
    }

    return (
        // Set visibility of the modal based on if the user is logged in
        <div className={classes.modalShadow} style={visibility}>
            <ClickOutHandler onClickOut={handleClickOut}>
                <div className={classes.modalContainer}>
                    <div className={classes.logoContainer}>
                        <img src={logo} alt="Logo" className={classes.logoImg}/>
                        <h2 className={classes.logoName}>BlogPost</h2>
                    </div>
                    {/* If the current state is not the signup page, display this element */}
                    {!signupOpen &&
                        (<h2>Log In</h2>)
                    }
                    {signupOpen &&
                        (<h2>Sign Up</h2>)
                    }
                    {signupOpen && (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}></input>
                        </>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <label>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}></input>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
                    {signupOpen && 
                        <button className={classes.loginBtn} onClick={e => handleRegisterBtn(e)}>Sign Up</button>
                    }
                    {!signupOpen && 
                        <button className={classes.loginBtn} onClick={e => handleLoginBtn(e)}>Log In</button>
                    }
                    {!signupOpen &&
                    (<div className={classes.helpTxt}>
                        Don't have an account yet?
                        <button onClick={handleModeBtn} className={classes.textBtn}>Create an Account</button>
                    </div>
                    )}
                    {signupOpen &&
                    (<div className={classes.helpTxt}>
                        Already have an account?
                        <button onClick={handleModeBtn} className={classes.textBtn}>Log In</button>
                    </div>
                    )}   
                </div>
            </ClickOutHandler>
        </div>
    )
}

export default LoginModal;
