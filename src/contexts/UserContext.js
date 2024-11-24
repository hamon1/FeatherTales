import React, { createContext, useState } from 'react';
import { useUserQuery } from '../hooks/useUserQuery';

// import { useNavigation } from '../utils/navigate';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { data: user, isLoading, error } = useUserQuery();
    // const [user, setUser] = useState(null);
    // const { goToMain } = useNavigation();

    // const login = (userData) => {
    //     setUser(userData);
    //     sessionStorage.setItem('token', userData.token);
    // };

    const logout = () => {
        // setUser(null);
        sessionStorage.removeItem('token');
        window.location.href = '/';
        // goToMain();
    };

    return (
        <UserContext.Provider value={{ user, isLoading, error, logout  }}>
            {children}
        </UserContext.Provider>
    );
};