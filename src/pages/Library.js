import React, { useState, useContext, useEffect } from 'react';
import { deleteDoc } from '../api';
import { useNavigation } from '../utils/navigate';
import { UserContext } from '../contexts/UserContext';

import { useUserQuery, useCategoriseUpdateMutation } from '../hooks/useUserQuery';

import { useDocumentQuery } from "../hooks/useDocumentQuery";

import Doclist_section from '../components/doclist_section';
import { CategorySection } from '../components/category_section';
import Loading from './Loading';


import { getDocsFromCategory } from '../api';

const Library = () => {
    const token = sessionStorage.getItem('token');

    const { goToLogin } = useNavigation();


    const { data: user, isLoading, error} = useUserQuery(token);

    const { data: docs, isLoading: isDocsLoading, error: docsError, refetch } = useDocumentQuery(token);

    console.log("user: " + user);
    console.log("docs: " + docs);

    const [filteredDocs, setFilteredDocs] = useState([]);
    
    const [ CategoryDocsData, setCategoryDocsData ] = useState([]);
    
    const { mutate } = useCategoriseUpdateMutation();
    
    const [ selectedCategory, setSelectedCategory ] = useState('');
    
    const [ isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [newCategory, setNewCategory] = useState('');
    
    const [categoryEditMode, setCategoriesEditMode] = useState(false);

    const [isFetchingDocs, setIsFetchingDocs] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [isDragging, setIsDragging] = useState(false);

    const { goToDocview } = useNavigation();
        
        console.log('📍library / token: ' + token);
        
        const [isTwoColumns, setIsTwoColumns] = useState(window.innerWidth > 768);
        
        const [retryCount, setRetryCount] = useState(0);
        const maxRetries = 3;

        useEffect(() => {
            console.log("📍 dragging changed: " + isDragging);
        }, [isDragging]);
        
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
            }
    }, [docs, token, retryCount, refetch]);

        
    useEffect(() => {
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
    
    if (!docs) 
    return 
<Loading/>

const handleDraggingState = (state) => {
    setIsDragging(state);
};

const handleDeleteDoc = async (token, docId, refetch, setFilteredDocs) => {
    try {
            deleteDoc(token, docId);
    
            console.log("✅ 삭제 완료");
            await refetch(); // 문서 목록 다시 불러오기
    
            // 🔥 refetch 후 수동으로 상태 업데이트
            setFilteredDocs((prevDocs) => prevDocs.filter(doc => doc._id !== docId));
            console.log("data refetched");
        } catch (error) {
            console.error("❌ 삭제 실패:", error);
        }
    };
    
    const handleCreateDoc = async () => {
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


    // 공백 또는 특수문자 포함 여부 확인 (한글, 영문, 숫자, 밑줄(_)만 허용)
    const isValidCategory = (category) => {
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
            <Loading/>
        ):
        <div class="library-background">
            <div class="library-container">

                <div class="add_button">
                    <button class="doc-add-button" onClick={()=> handleCreateDoc()}>+</button>
                </div>
                <div 
                    className={`bookcase ${isTwoColumns ? "grid grid-cols-2 gap-4 p-4" : "grid grid-cols-1 gap-4 p-4"}`}
                >
                    {isFetchingDocs ? (
                        <Loading/>
                    ) : error ? (
                        <p>문서를 불러오는 중 오류 발생: {error}</p>
                    ) : filteredDocs.length > 0 ? (
                        filteredDocs.map(doc => (
                            <Doclist_section key={doc._id} data={doc} onDelete={() => handleDeleteDoc(token, doc._id, refetch, setFilteredDocs)} refetch={refetch} handleDraggingState={handleDraggingState}/>
                        ))
                    ) : (
                        <p>No documents yet</p>
                    )}

                </div>
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
                <div class="tags-container">
                    {/* <div class="category-box"> */}
                    <div 
                        className={`category-box ${isDragging ? "hovered" : ""}`} 
                    >
                        <div class="category-scroll">
                            <button 
                                    className={selectedCategory === '' ? "categories-tag-selected" : "categories-tag"}
                                    onClick={() => setSelectedCategory('')}
                                > 
                                전체
                            </button>
                            {categoriesList(user.categories)}
                        </div>
                            </div>
                        <div class="tooltip-container">
                            <button
                                onClick={() => handleCategoryEdit(true)}
                                class="category-edit-button"
                                >
                                &#9998;
                            </button>
                            <span class="tooltip-text">카테고리 수정</span>
                        </div>
                </div>
            </div>
        </div>
    }
    </>
    )
}

export default Library;