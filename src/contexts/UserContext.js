import React, { createContext } from 'react';
import { useUserQuery } from '../hooks/useUserQuery';

// 로그인한 사용자 정보(user, isLoading, error)와 logout 함수를 전역으로 제공
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { data: user, isLoading, error } = useUserQuery();

    const logout = () => {
        sessionStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <UserContext.Provider value={{ user, isLoading, error, logout }}>
            {children}
        </UserContext.Provider>
    );
};
