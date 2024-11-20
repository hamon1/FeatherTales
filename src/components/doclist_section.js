import React from 'react';
import { useNavigation } from '../utils/navigate';

import { api, deleteDoc } from '../api';

const Doclist_section = ({key, data, onDelete}) => {
    const { goToDocview } = useNavigation();

    const handleClick = (docId) => {
        console.log('Document ID:', docId);
        goToDocview(docId);
    }

    // const handleDelete = async (docId) => {
    //     try {
    //         const token = sessionStorage.getItem('token');

    //         await deleteDoc(token, docId);
    //         console.log('Document deleted!');
    //     } catch (error) {
    //         console.error('Failed to delete document', error.response.data.msg);
    //     }
    // }

    return (
        <div class="book">
            <div class="cover">
                {/* <img src="book_cover.jpg" alt="book cover" /> */}
            </div>
            <div class="title-library">{data.title}</div>
            <div class="date">{data.updatedAt}</div>
            <div class="actions">
                <button class="button" onClick={()=>handleClick(data.docid)}>수정</button>
                <button class="button" onClick={()=>onDelete()}>삭제</button>
            </div>
        </div>
    )
}
export default Doclist_section;