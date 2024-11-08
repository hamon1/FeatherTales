import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { UserContext } from './contexts/UserContext';
import { useNavigation } from "./utils/navigate";
import './App.css';

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
                            <li><Link to="/home">Home</Link></li>
                            <li><button onClick={handleLoout}>로그아웃</button></li>
                            <li><Link to="/customize">커스텀</Link></li>
                            <li><Link to="/profile">{user.username}</Link></li>
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