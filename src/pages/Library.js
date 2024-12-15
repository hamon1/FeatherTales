import React, { useState, useContext, useEffect } from 'react';
import { api, createDoc, updateDoc, deleteDoc, searchDocs, getDocs, addCategory, getCategories } from '../api';
import { useNavigation } from '../utils/navigate';
import { UserContext } from '../contexts/UserContext';
import { DocsContext } from '../contexts/DocContext';

import { useUserQuery, useUserUpdateMutation, useCategoriseUpdateMutation } from '../hooks/useUserQuery';

import { useDocumentQuery } from "../hooks/useDocumentQuery";

import Doclist_section from '../components/doclist_section';
import { CategorySection } from '../components/category_section';
import LoadingPage from './LoadingPage';

import { handleDeleteDoc } from '.././utils/docUtils';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const Library = () => {
    const { data: user, isLoading, error} = useUserQuery();

    const { data: docs } = useDocumentQuery();
    console.log(docs);

    const { mutate } = useCategoriseUpdateMutation();

    // const [isLoading, setIsLoading] = useState(true);

    // const { user, setUser } = useContext(UserContext);
    // const { docs, setDocs } = useContext(DocsContext); // use DocsContext to get docs.

    const [ isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
    const [categories, setCategories] = useState([]);

    const [newCategory, setNewCategory] = useState('');

    const [categoryEditMode, setCategoriesEditMode] = useState(false);

    const { goToDocview } = useNavigation();
    // const [docs, setDocs] = useState([
    //     // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    // ]);
    
    const token = sessionStorage.getItem('token');
    console.log('library token: ' + token);

    const handleCreateDoc = async (docData) => {
        // getDocs(token, user.userid);

        goToDocview();
    }

    const handleCategoryEdit = async (value) => {
        if (value) {
            setCategoriesEditMode(true);
            setIsVisibleAddCategory(true);
        }
        else {
            setCategoriesEditMode(false);
            setIsVisibleAddCategory(false);
        }
    }

    const handleUpdateCategory = async (newCategory) => {
        try {
            mutate(newCategory, {
                onSuccess: () => {
                    // setUser((prev) => ({ ...prev, ...updatedAvatar }));
                    // setIsVisibleAddCategory(false);
                    setCategoriesEditMode(false);
                    alert('생성');
                },
                onError: (error) => {
                    alert(error.response.data.msg);
                    console.error(error.response.data.msg);
                }
            })
        } catch (error) {
            console.error("Failed to save category", error);
        }
    }

    function docListComponent(docData) {
        const len = docData.length;
        if (len === 0) {
            return <p>No documents yet</p>;
        }

        
        return docData.map(doc => {
            return (<Doclist_section 
                key= {doc.docid}
                data={doc}
                onDelete={() => handleDeleteDoc(token, doc.docid)}
            />
        )})
    }

    function categoriesList(categories) {

        if (categories.length === 0) {
            return <p>No categories yet</p>;
        }
        return categories.map((category, index) => {
            // const [, dropRef] = useDrop({
            //     accept: 'DOC',
            //     drop: (draggedItem) => {
            //         console.log(draggedItem);
            //     }
            // })
            // return (<div class="categories-tag" key={index}>{category.type}</div>)
            return (
                <CategorySection 
                    key= {index}
                    category={category}
                    editMode={categoryEditMode}
                    // index={index}
                />
            )
    })
    }


    return (
        <>
        {isLoading ? (
            <LoadingPage isLoading={isLoading}/>
        ):
        <div class="library-background">
            <div class="library-container">
                {/* <h1>t</h1> */}
                {/* <div> */}
                <div class="add_button">
                    <button class="doc-add-button" onClick={()=> handleCreateDoc()}>+</button>
                {/* </div> */}
                {/* <div class="avatar library">
                        <p>avatar</p>
                    </div> */}
                </div>
                <div class="bookcase">
                    {docListComponent(docs.documents)}
                </div>
            </div>
                <div class="tags-container">
                    <button
                        onClick={() => handleCategoryEdit(true)}
                    >
                        +
                    </button>
                    {isVisibleAddCategory ? (
                        <div class="add-category">
                            <button
                                onClick={()=> handleCategoryEdit(false)}
                            >
                                -
                            </button>
                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}/>
                            <button onClick={() => handleUpdateCategory(newCategory)}>카테고리 추가</button>
                        </div>

                    ) :
                        <></>
                    }
                    {/* <button>전체</button> */}
                    {categoriesList(user.categories)}
                </div>
        </div>
    }
    </>
    )
}

export default Library;