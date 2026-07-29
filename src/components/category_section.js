import React from 'react';
import { useDrop } from 'react-dnd';

import { useDocUpdateMutation } from '../hooks/useDocumentQuery';
import { useCategoriseDeleteMutation } from '../hooks/useUserQuery';

// 카테고리 태그 컴포넌트
// - 클릭 시 해당 카테고리 문서 필터링
// - 드래그된 문서를 드롭하면 해당 카테고리로 이동
// - editMode일 때 삭제 버튼 노출
export const CategorySection = ({ category, index, editMode, selectedCategory, setCategoryDocsData, setSelectedCategory }) => {
    const token = sessionStorage.getItem('token');
    const { mutate } = useDocUpdateMutation(token);
    const { mutate: mutate2 } = useCategoriseDeleteMutation(token);

    const categoryClass = category.type === selectedCategory
        ? 'categories-tag-selected'
        : 'categories-tag';

    // ─── DnD 설정 ─────────────────────────────────────────────────────────────

    // 문서를 이 카테고리에 드롭하면 해당 문서의 카테고리를 업데이트
    const [, dropRef] = useDrop({
        accept: 'DOC',
        drop: (draggedItem) => {
            const docData = { category: category.type };
            mutate({ docid: draggedItem.data._id, docData }, {
                onSuccess: () => console.log('category updated!'),
                onError: (error) => console.error("Failed to update category", error),
            });
        },
    });

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleCategoryDelete = (categoryId) => {
        mutate2(categoryId, {
            onSuccess: () => console.log('✅ category deleted!'),
            onError: (error) => console.error("❌ Failed to delete category", error),
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="category-container">
            <div
                ref={dropRef}
                className={categoryClass}
                key={index}
                onClick={() => setSelectedCategory(category.type)}
            >
                {category.type}
            </div>
            {editMode && (
                <button
                    className="category-edit-btn"
                    onClick={() => handleCategoryDelete(category._id)}
                >
                    -
                </button>
            )}
        </div>
    );
};
