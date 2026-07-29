import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserData, updateUserData, addCategory, deleteCategory } from '../api';

// ─── 사용자 데이터 조회 ────────────────────────────────────────────────────────

export const useUserQuery = (token) => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const data = await getUserData(token);
            return data;
        },
        enabled: !!token,
    });
};

// ─── 아바타/닉네임 수정 ────────────────────────────────────────────────────────

export const useUserUpdateMutation = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updateUser) => {
            const { data } = await updateUserData(token, updateUser);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        },
    });
};

// ─── 카테고리 추가 ─────────────────────────────────────────────────────────────

export const useCategoriseUpdateMutation = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updateCategory) => {
            const { data } = await addCategory(token, updateCategory);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        },
    });
};

// ─── 카테고리 삭제 ─────────────────────────────────────────────────────────────

export const useCategoriseDeleteMutation = () => {
    const [token] = useState(sessionStorage.getItem('token'));
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryId) => {
            const { data } = await deleteCategory(token, categoryId);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        },
    });
};
