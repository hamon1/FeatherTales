import React, {useRef, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { useDocUpdateMutation } from '../hooks/useDocumentQuery'

export const CategorySection = ({category, index}) => {
    const { mutate } = useDocUpdateMutation();

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
    <div 
        ref={dropRef}
        class="categories-tag" 
        key={index}
        >
            {category.type}
        </div>
        )
}