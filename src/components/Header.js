import classes from './HeaderStyle.module.css';
import logo from '../image/logo.png'
import profilepic from '../image/avatar.png';
import React, { useContext, useState, useRef } from "react";
import LoginModalContext from '../context/LoginModalContext';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

function Header() {

    const [searchQuery, setSearchQuery] = useState('');

    // Context for the login/signup modal (used to close/open it)
    const modalContext = useContext(LoginModalContext);
    // Context for if a user is logged in
    const userContext = useContext(UserContext);

    const navigate = useNavigate();
    const searchInput = useRef(null);


    function handleLogIn() {
        modalContext.setVisible(true);
    };

    function handleLogOut() {
        userContext.logOut();
    };

    function handleSearch(e) {
        e.preventDefault();
        searchInput.current.blur();
        setSearchQuery("")
        navigate('/search/q='+encodeURIComponent(searchQuery),{state:{searchQuery:searchQuery}})
    }

    return (
        <div className={classes.container}>
            <Link to={"/"} className={classes.logoContainer} style={{ textDecoration: 'none', color:'#000' }}>
                <img src={logo} alt="Logo" className={classes.logoImg}/>
                <h2 className={classes.logoName}>BlogPost</h2>
            </Link>
            <form className={classes.searchContainer} onSubmit={e => {handleSearch(e)}}>
                <input className={classes.searchInput} ref={searchInput} placeholder="Search for a post" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            </form>
            <div className={classes.accountContainer}>
                {userContext.username && (
                    <>
                        <img src={profilepic} alt="AccountImage" className={classes.accountImg}/>
                        <div className={classes.accountBtnContainer}>
                            <h5>Hello, <br></br>{userContext.username}</h5>
                            <button className={classes.accountBtn} onClick={handleLogOut}>Log out</button>
                        </div>
                    </>
                )}
                {!userContext.username && (
                    <div className={classes.accountBtnContainer}>
                        <button className={classes.logInBtn} onClick={handleLogIn}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Log In
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header;