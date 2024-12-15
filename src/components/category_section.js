import React, {useRef, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { useDocUpdateMutation } from '../hooks/useDocumentQuery'

import { deleteCategory } from '../api';

export const CategorySection = ({category, index, editMode}) => {
    const { mutate } = useDocUpdateMutation();
    const token = sessionStorage.getItem('token');


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
                class="categories-tag" 
                key={index}
                >
                    {category.type}
            </div>
            {editMode && <button
                class="category-edit-btn"
                onClick={() => deleteCategory(token, category._id)}
            >-</button>}  {/* editMode is true when drag and drop is enabled */}
        </div>
        )
}