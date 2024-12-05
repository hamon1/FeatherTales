import React, {useRef, useState} from 'react';
import { useNavigation } from '../utils/navigate';

import { api, deleteDoc } from '../api';

import Swal from "sweetalert2";

import { DndProvider, useDrag, useDrop } from 'react-dnd';


const Doclist_section = ({key, data, onDelete}) => {
    const [isDraggable, setIsDraggable] = useState(false);
    const { goToDocview } = useNavigation();

    const ref = useRef(null);
    const timeOutRef = useRef(null);

    const [, dragRef, previewRef] = useDrag({
        type: 'DOC',
        item: { data },
        canDrag: () => isDraggable,
    })

    
    const handleMouseDown = () => {
        console.log('handleMouseDown');
        timeOutRef.current = setTimeout(() => {
            setIsDraggable(true);
            console.log('isDraggable: ', isDraggable);
        }, 500);
    }
    const handleMouseUp = () => {
        console.log('handleMouseUp');
        clearTimeout(timeOutRef.current);
        setIsDraggable(false);
    }
    
    dragRef(ref);
    previewRef(ref);
    const handleClick = (docId) => {
        console.log('Document ID:', docId);
        goToDocview(docId);
    }

    const handleDelete = () => {
        
        // const confirmed = window.confirm('Are you sure you want to delete');

        // if (confirmed) {
        //     console.log('handleDelete');
        //     onDelete();
        // }
        // else {
        //     return;
        // }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "삭제된 문서는 영원히 사라집니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제할거에요.',
            cancelButtonText: '아, 잘못눌렀다.',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete();
            } else if (result.isCancelled) {
                console.log('Delete canceled');
            }
        });

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
        <div 
            class="book" 
            ref={ref}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div class="cover">
                {/* <img src="book_cover.jpg" alt="book cover" /> */}
            </div>
            <div>{data.category}</div>
            <div class="title-library">{data.title}</div>
            <div class="date">{data.updatedAt}</div>
            <div class="actions">
                <button class="update library-btn button" onClick={()=>handleClick(data._id)}>수정</button>
                <button class="delete library-btn button" onClick={handleDelete}>삭제</button>
            </div>
        </div>
    )
}
export default Doclist_section;