import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocs, createDoc, updateDoc, deleteDoc } from '../api';

// ─── 문서 목록 조회 ────────────────────────────────────────────────────────────

export const useDocumentQuery = (token) => {
    return useQuery({
        queryKey: ['docs'],
        queryFn: async () => {
            const data = await getDocs(token);
            return data;
        },
    });
};

// ─── 문서 생성 ─────────────────────────────────────────────────────────────────

export const useDocCreateMutation = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDoc) => {
            const { data } = await createDoc(token, newDoc);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['docs']);
        },
        onError: (error) => {
            console.error('Failed to create doc', error.response.data.msg);
        },
    });
};

// ─── 문서 수정 ─────────────────────────────────────────────────────────────────

export const useDocUpdateMutation = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ docid, docData }) => {
            const { data } = await updateDoc(token, docid, docData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['docs']);
        },
    });
};
