import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop, useDragLayer } from 'react-dnd';
import Swal from 'sweetalert2';

import { useNavigation } from '../utils/navigate';

// 드래그 중일 때 마우스 위치에 따라 따라다니는 레이어
const CustomDragLayer = () => {
    const { isDragging, currentOffset } = useDragLayer((monitor) => ({
        isDragging: monitor.isDragging(),
        currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || !currentOffset) return null;

    return (
        <div
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                left: currentOffset.x,
                top: currentOffset.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
            }}
        >
            드래그 중...
        </div>
    );
};

const Doclist_section = ({ data, onDelete, refetch, handleDraggingState }) => {
    const { goToDocview } = useNavigation();

    // ─── State ────────────────────────────────────────────────────────────────
    const [isDraggable, setIsDraggable] = useState(false);
    const [position, setPosition] = useState({ x: -100, y: -100 });

    const ref = useRef(null);
    const timeOutRef = useRef(null);
    const dragPreview = useRef(null);

    // ─── DnD 설정 ─────────────────────────────────────────────────────────────
    // 500ms 이상 누르고 있을 때만 드래그 가능 (오인 드래그 방지)
    const [, dragRef, previewRef] = useDrag({
        type: 'DOC',
        item: { data },
        canDrag: () => isDraggable,
    });

    dragRef(ref);
    previewRef(dragPreview);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    // 500ms 유지 시 드래그 모드 활성화
    const handleMouseDown = (event) => {
        setPosition({ x: event.clientX, y: event.clientY });
        timeOutRef.current = setTimeout(() => {
            setIsDraggable(true);
            handleDraggingState(true);
        }, 500);
    };

    const handleMouseUp = () => {
        clearTimeout(timeOutRef.current);
        setIsDraggable(false);
        handleDraggingState(false);
    };

    const handleClick = (docId) => {
        goToDocview(docId);
    };

    const handleDelete = () => {
        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "삭제된 문서는 영원히 사라집니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제할거에요.',
            cancelButtonText: '아, 잘못눌렀다.',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete();
                alert("삭제 완료");
            }
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <div
                className="book"
                ref={ref}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="book-page">
                    <div className="cover" />
                    <div className="category-tag">
                        <div>{data.category}</div>
                    </div>
                    <div className="title-library">{data.title}</div>
                    <div className="date">{data.updatedAt}</div>
                    <div className="actions">
                        <button className="update library-btn button" onClick={() => handleClick(data._id)}>수정</button>
                        <button className="delete library-btn button" onClick={handleDelete}>삭제</button>
                    </div>
                </div>
            </div>
            <CustomDragLayer />
        </>
    );
};

export default Doclist_section;
