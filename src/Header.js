import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { UserContext } from './contexts/UserContext';
import { useNavigation } from "./utils/navigate";
import './App.css';

import profileImage from './assets/profile.png';
import homeImage from './assets/Home.png';
import customizeImage from './assets/Custom.png';
import logoutImage from './assets/Logout.png';

export const Header = () => {
    const { user, logout } = useContext(UserContext);

    const { goToMain } = useNavigation();

    const handleLoout = () => {
        logout();
        goToMain();
    }

    return (
        <header>
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li data-hover="홈"><Link to="/home">
                                <img 
                                class="home"
                                src={homeImage}
                                />
                                </Link></li>
                            <li  data-hover="로그아웃"><button onClick={handleLoout}>
                                <img 
                                class="logout"
                                src={logoutImage}
                                />
                                </button></li>
                            <li data-hover="커스텀"><Link to="/customize">
                                    <img
                                    class="customize"
                                    src={customizeImage}
                                    />
                                </Link></li>
                            <li data-hover="프로필"><Link to="/profile">
                                <img 
                                class="profile" 
                                src={profileImage}
                                alt="Profile"
                                />
                                </Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">login</Link></li>
                            <li><Link to="/register">회원가입</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}