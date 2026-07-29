import React, { useState, useContext, useEffect } from 'react';

import { deleteDoc, getDocsFromCategory } from '../api';
import { useUserQuery, useCategoriseUpdateMutation } from '../hooks/useUserQuery';
import { useDocumentQuery } from '../hooks/useDocumentQuery';
import { useNavigation } from '../utils/navigate';
import { UserContext } from '../contexts/UserContext';

import Doclist_section from '../components/doclist_section';
import { CategorySection } from '../components/category_section';
import Loading from './Loading';

const Library = () => {
    const token = sessionStorage.getItem('token');
    const { goToLogin, goToDocview } = useNavigation();

    // ─── 서버 상태 (TanStack Query) ───────────────────────────────────────────
    const { data: user, isLoading, error } = useUserQuery(token);
    const { data: docs, refetch } = useDocumentQuery(token);
    const { mutate } = useCategoriseUpdateMutation();

    // ─── State ────────────────────────────────────────────────────────────────
    const [filteredDocs, setFilteredDocs]           = useState([]);
    const [CategoryDocsData, setCategoryDocsData]   = useState([]);
    const [selectedCategory, setSelectedCategory]   = useState('');
    const [categories, setCategories]               = useState([]);
    const [newCategory, setNewCategory]             = useState('');
    const [categoryEditMode, setCategoriesEditMode] = useState(false);
    const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
    const [isFetchingDocs, setIsFetchingDocs]       = useState(false);
    const [fetchError, setFetchError]               = useState(null);
    const [isDragging, setIsDragging]               = useState(false);
    const [isTwoColumns, setIsTwoColumns]           = useState(window.innerWidth > 768);
    const [retryCount, setRetryCount]               = useState(0);

    const maxRetries = 3;

    // ─── Effects ──────────────────────────────────────────────────────────────

    // 토큰 없거나 문서 로드 실패 시 재시도 후 로그인 이동
    useEffect(() => {
        if (!token) {
            goToLogin();
            return;
        }
        if (!docs && retryCount < maxRetries) {
            setTimeout(() => {
                refetch();
                setRetryCount((prev) => prev + 1);
            }, 2000);
        } else if (!docs && retryCount >= maxRetries) {
            goToLogin();
        }
    }, [docs, token, retryCount, refetch]);

    // 카테고리 선택 시 해당 카테고리 문서만 필터링
    useEffect(() => {
        if (!selectedCategory) {
            setFilteredDocs(docs?.documents || []);
            return;
        }

        const fetchData = async () => {
            setIsFetchingDocs(true);
            setFetchError(null);
            try {
                const data_ = await getDocsFromCategory(token, selectedCategory);
                if (data_.data && Array.isArray(data_.data)) {
                    setFilteredDocs(data_.data);
                } else {
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
    }, [selectedCategory, docs]);

    // 화면 너비에 따라 2열/1열 전환
    useEffect(() => {
        const handleResize = () => setIsTwoColumns(window.innerWidth > 1200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 로딩 중 early return
    if (!docs) return <Loading />;

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleDraggingState = (state) => {
        setIsDragging(state);
    };

    const handleDeleteDoc = async (token, docId, refetch, setFilteredDocs) => {
        try {
            deleteDoc(token, docId);
            await refetch();
            setFilteredDocs((prevDocs) => prevDocs.filter(doc => doc._id !== docId));
        } catch (error) {
            console.error("❌ 삭제 실패:", error);
        }
    };

    const handleCreateDoc = async () => {
        goToDocview();
    };

    // 카테고리 편집 모드 토글
    const handleCategoryEdit = (value) => {
        setCategoriesEditMode(value);
        setIsVisibleAddCategory(value);
    };

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
                },
            });
        } catch (error) {
            console.error("Failed to save category", error);
        }
    };

    // 한글, 영문, 숫자, 밑줄(_)만 허용
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

    // ─── Render Helpers ───────────────────────────────────────────────────────

    const categoriesList = (categories) => {
        if (categories.length === 0) {
            return <p>No categories yet</p>;
        }
        return categories.map((category, index) => (
            <CategorySection
                key={index}
                category={category}
                editMode={categoryEditMode}
                selectedCategory={selectedCategory}
                setCategoryDocsData={setCategoryDocsData}
                setSelectedCategory={setSelectedCategory}
            />
        ));
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="library-background">
                    <div className="library-container">

                        <div className="add_button">
                            <button className="doc-add-button" onClick={handleCreateDoc}>+</button>
                        </div>

                        <div className={`bookcase ${isTwoColumns ? "grid grid-cols-2 gap-4 p-4" : "grid grid-cols-1 gap-4 p-4"}`}>
                            {isFetchingDocs ? (
                                <Loading />
                            ) : error ? (
                                <p>문서를 불러오는 중 오류 발생: {error}</p>
                            ) : filteredDocs.length > 0 ? (
                                filteredDocs.map(doc => (
                                    <Doclist_section
                                        key={doc._id}
                                        data={doc}
                                        onDelete={() => handleDeleteDoc(token, doc._id, refetch, setFilteredDocs)}
                                        refetch={refetch}
                                        handleDraggingState={handleDraggingState}
                                    />
                                ))
                            ) : (
                                <p>No documents yet</p>
                            )}
                        </div>

                        {isVisibleAddCategory && (
                            <div className="add-category">
                                <button onClick={() => handleCategoryEdit(false)}>-</button>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button onClick={() => isValidCategory(newCategory)}>카테고리 추가</button>
                            </div>
                        )}

                        <div className="tags-container">
                            <div className={`category-box ${isDragging ? "hovered" : ""}`}>
                                <div className="category-scroll">
                                    <button
                                        className={selectedCategory === '' ? "categories-tag-selected" : "categories-tag"}
                                        onClick={() => setSelectedCategory('')}
                                    >
                                        전체
                                    </button>
                                    {categoriesList(user.categories)}
                                </div>
                            </div>
                            <div className="tooltip-container">
                                <button
                                    onClick={() => handleCategoryEdit(true)}
                                    className="category-edit-button"
                                >
                                    &#9998;
                                </button>
                                <span className="tooltip-text">카테고리 수정</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default Library;
