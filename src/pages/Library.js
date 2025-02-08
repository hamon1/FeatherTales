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
import { useNavigate } from 'react-router-dom';

import { getDocsFromCategory } from '../api';

const Library = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const { goToLogin } = useNavigation();


    const { data: user, isLoading, error} = useUserQuery(token);

    // const { data: docs } = useDocumentQuery();
    const { data: docs, isLoading: isDocsLoading, error: docsError, refetch } = useDocumentQuery(token);

    console.log("user: " + user);
    console.log("docs: " + docs);

    const [filteredDocs, setFilteredDocs] = useState([]);
    
    const [ CategoryDocsData, setCategoryDocsData ] = useState([]);
    
    const { mutate } = useCategoriseUpdateMutation();
    
    // const [isLoading, setIsLoading] = useState(true);
    
    // const { user, setUser } = useContext(UserContext);
    // const { docs, setDocs } = useContext(DocsContext); // use DocsContext to get docs.
    const [ selectedCategory, setSelectedCategory ] = useState('');
    
    const [ isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [newCategory, setNewCategory] = useState('');
    
    const [categoryEditMode, setCategoriesEditMode] = useState(false);

    const [isFetchingDocs, setIsFetchingDocs] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const { goToDocview } = useNavigation();
    // const [docs, setDocs] = useState([
        //     // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
        // ]);
        
        console.log('library token: ' + token);
        
        const [isTwoColumns, setIsTwoColumns] = useState(window.innerWidth > 768);
        
        const [retryCount, setRetryCount] = useState(0);
        const maxRetries = 3;
        
        useEffect(() => {
            if (!token) {
                goToLogin(); // 토큰이 없으면 로그인 페이지로 이동
                
                return;
            }
            
            if (!docs && retryCount < maxRetries) {
                setTimeout(() => {
                    refetch(); // 문서 데이터 다시 요청
                    setRetryCount((prev) => prev + 1);
                }, 2000);
            } else if (!docs && retryCount >= maxRetries) {
                goToLogin(); // 일정 횟수 초과하면 로그인 페이지로 이동
                // navigate.goToLogin();
            }
    }, [docs, token, retryCount, refetch]);

    // if (isUserLoading || isDocsLoading) return <LoadingPage isLoading />;
    // if (userError || docsError) {
        //     console.error("Error:", userError || docsError);
        //     return <p>오류가 발생했습니다. 다시 시도해 주세요.</p>;
        // }
        
    useEffect(() => {
        // if (selectedCategory !== undefined && selectedCategory !== null) {
        //     console.log('category: ' + selectedCategory);
    
        //     const fetchData = async () => {
        //         try {
        //             const data_ = await getDocsFromCategory(token, selectedCategory);
        //             console.log("new data: ", data_);
        //         } catch (error) {
        //             console.error("Error fetching data: ", error);
        //         }
        //     };
    
        //     fetchData();
        // }
        console.log("📍 selected Category data fetching: ", selectedCategory);

        if (!selectedCategory) {
            setFilteredDocs(docs?.documents || []);
            return;
        }


        const fetchData = async () => {
            setIsFetchingDocs(true);
            setFetchError(null);

            try {
                const data_ = await getDocsFromCategory(token, selectedCategory);
                console.log("📍 new data: ", data_.data);

                if (data_.data && Array.isArray(data_.data)) {
                    setFilteredDocs(data_.data);
                } else {
                    console.error("❌ Invalid data format: ", data_);
                    setFilteredDocs([]);
                }

            } catch (error) {
                console.error("❌ Error fetching data: ", error);
                setFetchError(error);
                setFilteredDocs([]);
            } finally {
                setIsFetchingDocs(false);
            }
        };

        fetchData();
        
        console.log("📍 fetched data(category): ", filteredDocs.length);

    }, [selectedCategory, docs])
    
    useEffect(() => {
        const handleResize = () => {
            setIsTwoColumns(window.innerWidth > 1200); //768
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

    if (!docs) return <p>문서 데이터를 불러오는 중...</p>;
    
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

    const isValidCategory = (category) => {
        // 공백 또는 특수문자 포함 여부 확인 (한글, 영문, 숫자, 밑줄(_)만 허용)
        const regex = /^[가-힣a-zA-Z0-9_]+$/;

        if (!category.trim()) {
            alert("카테고리 이름을 입력하세요.");
            return false;
        }
        
        if (!regex.test(category)) {
            alert("카테고리 이름에는 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.");
            return false;
        }

        handleUpdateCategory(category);

        return true;
    };

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
                    selectedCategory={selectedCategory}
                    setCategoryDocsData={setCategoryDocsData}
                    setSelectedCategory={setSelectedCategory}
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

                <div class="add_button">
                    <button class="doc-add-button" onClick={()=> handleCreateDoc()}>+</button>
                </div>
                <div 
                // class="bookcase" 
                    className={`bookcase ${isTwoColumns ? "grid grid-cols-2 gap-4 p-4" : "grid grid-cols-1 gap-4 p-4"}`}
                >
                    {isFetchingDocs ? (
                        <p>문서를 불러오는 중...</p>
                    ) : error ? (
                        <p>문서를 불러오는 중 오류 발생: {error}</p>
                    ) : filteredDocs.length > 0 ? (
                        filteredDocs.map(doc => (
                            <Doclist_section key={doc.docid} data={doc} />
                        ))
                    ) : (
                        <p>No documents yet</p>
                    )}
                    {/* {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                        <Doclist_section key={doc.docid} data={doc} />
                    )) : <p>No documents yet</p>} */}
                </div>
                <div class="tags-container">
                    <div class="category-box">
                    {isVisibleAddCategory ? (
                        <div class="add-category">
                            <button
                                onClick={()=> handleCategoryEdit(false)}
                                >
                                -
                            </button>
                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}/>
                            <button onClick={() => isValidCategory(newCategory)}>카테고리 추가</button>
                        </div>

                    ) :
                    <></>
                    }
                    <div class="category-scroll">
                        {categoriesList(user.categories)}
                    </div>
                    <button
                        onClick={() => handleCategoryEdit(true)}
                        class="category-edit-button"
                        >
                        #
                    </button>
                    </div>
                </div>
            </div>
        </div>
    }
    </>
    )
}

export default Library;