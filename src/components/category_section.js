import React, {useRef, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { useDocUpdateMutation } from '../hooks/useDocumentQuery'
import { useCategoriseDeleteMutation } from '../hooks/useUserQuery';
import { deleteCategory, getDocsFromCategory } from '../api';

export const CategorySection = ({category, index, editMode, selectedCategory, setCategoryDocsData, setSelectedCategory}) => {
    const token = sessionStorage.getItem('token');
    const { mutate } = useDocUpdateMutation(token);
    const { mutate: mutate2 } = useCategoriseDeleteMutation(token);

    const categoryClass = category.type === selectedCategory
        ? 'categories-tag-selected'
        : 'categories-tag';

    const handleCategoryDelete = async(categoryId) => {
        console.log("📌 deleting category " + category);
        mutate2(categoryId, {
            onSuccess: () => {
                console.log('✅ category deleted!');
            },
            onError: (error) => {
                console.error("❌ Failed to delete category", error);
            },
        })
        console.log("✅ delete component: " + category.type);
    }

    const [, dropRef] = useDrop({
                accept: 'DOC',
                drop: (draggedItem) => {
                    console.log(draggedItem.data._id);
                    console.log("drop component: " + category.type);

                    const docData = {
                        category: category.type,
                    };

                    mutate({docid: draggedItem.data._id, docData}, {
                        onSuccess: () => {
                            console.log('category updated!');
                        },
                        onError: (error) => {
                            console.error("Failed to update category", error);
                        },
                        // variables: {
                        //     docId: draggedItem.data._id,
                        //     data,
                        // },
                    })
                }
            })

    return (
        <div class="category-container">
            <div 
                ref={dropRef}
                class={categoryClass} 
                key={index}
                onClick={async()=> {
                    console.log('category: ' + category.type + ' / ' + category._id);
                    setSelectedCategory(category.type);
                //     const data = await getDocsFromCategory(token, category.type);
                //     console.log("doc by category data: ", data);
                }
            }
                >
                    {category.type}
            </div>
            {editMode && <button
                class="category-edit-btn"
                onClick={() => handleCategoryDelete(category._id)}
            >-</button>}  {/* editMode is true when drag and drop is enabled */}
        </div>
        )
}