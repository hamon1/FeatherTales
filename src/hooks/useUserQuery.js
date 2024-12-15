import { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getUserData, updateUserData, addCategory, deleteCategory } from '../api';
// const token = sessionStorage.getItem('token');

export const useUserQuery = () => { 
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    console.log('?', token);

    // useEffect(() => {
    //     const storedToken = sessionStorage.getItem('token');
    //     setToken(storedToken); // 업데이트된 token 설정
    // }, []); // 한 번 실행

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

    // useEffect(() => {
    //     const storedToken = sessionStorage.getItem('token');
    //     setToken(storedToken); // 업데이트된 token 설정
    // }, []); // 한 번 실행

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

export const useCategoriseUpdateMutation = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    // useEffect(() => {
    //     const storedToken = sessionStorage.getItem('token');
    //     setToken(storedToken); // 업데이트된 token 설정
    // }, []); // 한 번 실행

    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: 
        async (updateCategory) => {
            console.log("category update");
            const { data } = await addCategory(token, updateCategory);
            console.log(data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['user'] );
        },
        
    });
};   

export const useCategoriseDeleteMutation = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    // useEffect(() => {
    //     const storedToken = sessionStorage.getItem('token');
    //     setToken(storedToken); // 업데이트된 token 설정
    // }, []); // 한 번 실행

    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: 
        async (categoryId) => {
            console.log("category update");
            const { data } = await deleteCategory(token, categoryId);
            console.log(data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['user'] );
        },
        
    });
};   