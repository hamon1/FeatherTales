import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getUserData, updateUserData } from '../api';
const token = sessionStorage.getItem('token');

export const useUserQuery = () => { 
    return useQuery({ 
        queryKey: ['user'], 
        queryFn: async () => {
        const { data } = await getUserData(token);
        return data;
}})
}

export const useUserUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: 
        async (updateUser) => {
            const { data } = await updateUserData(token, updateUser);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['user'] );
        },
        
    });
};   