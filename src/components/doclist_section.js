import React, {useRef, useState, useEffect} from 'react';
import { useNavigation } from '../utils/navigate';

import { api, deleteDoc } from '../api';

import Swal from "sweetalert2";

import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';

const CustomDragLayer = () => {
    const { isDragging, currentOffset } = useDragLayer((monitor) => ({
        isDragging: monitor.isDragging(),
        currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                left: currentOffset.x,
                top: currentOffset.y,
                transform: 'translate(-50%, -50%)', // 드래그 아이템을 마우스 중앙에 위치
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
            }}
        >
            드래그 중...
        </div>
    )
}

const Doclist_section = ({key, data, onDelete, refetch}) => {
    const [isDraggable, setIsDraggable] = useState(false);
    const [position, setPosition] = useState({x: -100, y: -100});

    const { goToDocview } = useNavigation();

    const ref = useRef(null);
    const timeOutRef = useRef(null);

    const dragPreview = useRef(null);

    const [, dragRef, previewRef] = useDrag({
        type: 'DOC',
        item: { data },
        canDrag: () => isDraggable,
    })

    console.log("📍 doclist section: ");

    // useEffect(() => {
    //     console.log('useEffect[drag]: ', isDraggable, position.x);
    //     const updateMousePosition = (event) => {
    //         console.log('updateMousePosition', position.x);
    //         // setPosition({x: event.clientX, y: event.clientY});
    //         if (isDraggable) {
    //             setPosition({ x: event.clientX, y: event.clientY });
    //         }
    //     };
    //     // if (isDraggable) {
    //         // 드래그 가능 상태일 때 이벤트 리스너 추가
    //         window.addEventListener('mousemove', updateMousePosition);
    //     // } else {
    //         // 드래그 가능 상태가 아닐 때 기존 리스너 제거
    //         // window.removeEventListener('mousemove', updateMousePosition);
    //     // }
    
    //     // 컴포넌트 언마운트 시 이벤트 리스너 제거
    //     return () => {
    //         window.removeEventListener('mousemove', updateMousePosition);
    //     };
    // },[isDraggable])

    
    const handleMouseDown = (event) => {
        console.log('handleMouseDown');
        setPosition({ x: event.clientX, y: event.clientY });
        
        timeOutRef.current = setTimeout(() => {
            setIsDraggable(true);
            console.log('isDraggable: ', isDraggable);
        }, 500);
    }

    // const handleMouseMove = (event) => {
    //     // if (!isDraggable) return;
    //     console.log('handleMouseMove');

    //     setPosition({ x: event.clientX, y: event.clientY });
    // }

    const handleMouseUp = () => {
        console.log('handleMouseUp');
        clearTimeout(timeOutRef.current);
        setIsDraggable(false);
    }
    
    dragRef(ref);
    previewRef(dragPreview);

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

                alert("삭제 완료");
                // refetch();

                console.log("✅ deteted and refetched");
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
        <>
        <div 
            class="book" 
            ref={ref}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            // onMouseMove={handleMouseMove}
        >
            <div class="book-page">

                <div class="cover">
                    {/* <img src="book_cover.jpg" alt="book cover" /> */}
                </div>
                <div class="category-tag">
                    <div>{data.category}</div>
                </div>
                <div class="title-library">{data.title}</div>
                <div class="date">{data.updatedAt}</div>
                <div class="actions">
                    <button class="update library-btn button" onClick={()=>handleClick(data._id)}>수정</button>
                    <button class="delete library-btn button" onClick={handleDelete}>삭제</button>
                </div>
            </div>
        </div>
        <CustomDragLayer/>
        </>
    )
}
export default Doclist_section;