import React, { createContext, useState } from 'react';

// import { useNavigation } from '../utils/navigate';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const { goToMain } = useNavigation();

    // const login = (userData) => {
    //     setUser(userData);
    //     sessionStorage.setItem('token', userData.token);
    // };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('token');
        // goToMain();
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout  }}>
            {children}
        </UserContext.Provider>
    );
};