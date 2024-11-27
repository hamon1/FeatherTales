import { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getUserData, updateUserData } from '../api';
// const token = sessionStorage.getItem('token');

export const useUserQuery = () => { 
    // console.log('?', token);
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken); // 업데이트된 token 설정
    }, []); // 한 번 실행

    return useQuery({ 
        queryKey: ['user'], 
        queryFn: 
        async () => {
        const  data  = await getUserData(token);
        console.log('user query', data, token);
        return data;
}})
}

export const useUserUpdateMutation = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken); // 업데이트된 token 설정
    }, []); // 한 번 실행

    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: 
        async (updateUser) => {
            console.log("user update");
            const { data } = await updateUserData(token, updateUser);
            console.log(data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['user'] );
        },
        
    });
};   