import { useEffect, useState  } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getDocs, createDoc, updateDoc, deleteDoc, searchDocs } from '../api';

export const useDocumentQuery = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken); // 업데이트된 token 설정
    }, []); // 한 번 실행

    return useQuery({
        queryKey: ['docs'], 
        queryFn: 
        async () => {
        const  data  = await getDocs(token);
        console.log('user query', data, token);
        return data;
}
    })
};

export const useDocCreateMutation = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken); // 업데이트된 token 설정
    }, []); // 한 번 실행

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDoc) => {
            console.log('creating new doc...', newDoc)
            const { data } = await createDoc(token, newDoc);
            console.log('created doc. res: ', data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['docs'] );
        },
        onError: (error) => {
            console.error('Failed to create doc', error.response.data.msg);
        }
    })
}

export const useDocUpdateMutation = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken); // 업데이트된 token 설정
    }, []); // 한 번 실행

    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: 
        async (docid, updateDoc) => {
            console.log("doc update");
            const { data } = await updateDoc(token, docid, updateDoc);
            console.log(data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries( ['docs'] );
        },
        
    });
};  