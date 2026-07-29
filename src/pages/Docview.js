import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { createDoc, updateDoc, getDocsbyDocId } from '../api';
import { useUserQuery } from '../hooks/useUserQuery';
import { useDocumentQuery } from '../hooks/useDocumentQuery';
import { useNavigation } from '../utils/navigate';
import { handleDeleteDoc } from '../utils/docUtils';
import { UserContext } from '../contexts/UserContext';

const Docview = () => {
    const token = sessionStorage.getItem('token');
    const { docId } = useParams();

    const { goToLogin, goToLibrary } = useNavigation();
    const navigate = useNavigate();

    // ─── 서버 상태 ────────────────────────────────────────────────────────────
    const { data: user, isLoading, error } = useUserQuery(token);
    const { data: docs } = useDocumentQuery(token);

    // ─── State ────────────────────────────────────────────────────────────────
    const [categories, setCategories]           = useState([]);
    const [docData, setDocData]                 = useState('');
    const [title, setTitle]                     = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [content, setContent]                 = useState('');
    const [isEditing, setIsEditing]             = useState(false);

    // ─── Effects ──────────────────────────────────────────────────────────────

    // 토큰 없으면 로그인 페이지로 이동 (마운트 시 1회)
    useEffect(() => {
        if (!token) {
            goToLogin();
        }
    }, []);

    // 유저 데이터 로드 후 카테고리 초기값 설정
    useEffect(() => {
        if (user) {
            setCategories(user.categories);
            setSelectedCategory(user.categories[0]?.type || '');
        }
    }, [user]);

    // docId가 있으면 기존 문서 데이터 불러오기 (수정 모드)
    useEffect(() => {
        if (!docId) return;

        const fetchDocData = async () => {
            try {
                const data = await getDocsbyDocId(token, docId);
                if (data) {
                    setIsEditing(true);
                    setTitle(data.document.title);
                    setContent(data.document.content);
                } else {
                    setIsEditing(false);
                }
            } catch (error) {
                console.error('Failed to fetch document', error.response.data.msg);
            }
        };

        fetchDocData();
    }, []);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    // 새 문서 생성 후 해당 문서의 URL로 이동
    const changeDocId = (newDocId) => {
        navigate(`/docview/${newDocId}`);
    };

    const categoriesList = () => {
        if (categories) {
            return categories.map((categoryItem, index) => (
                <>
                    <option key={`option-${index}`} value={categoryItem.type}>{categoryItem.type}</option>
                </>
            ));
        } else {
            return <option value="">카테고리를 선택하세요.</option>;
        }
    };

    // ─── Handlers ─────────────────────────────────────────────────────────────

    // isEditing 여부에 따라 문서 생성 또는 수정
    const handleDocData = async () => {
        const data = {
            userid: user.userid,
            title: title,
            category: selectedCategory,
            content: content,
        };

        try {
            if (isEditing) {
                await updateDoc(token, docId, data);
                console.log('문서 수정!');
            } else {
                const newDoc = await createDoc(token, data);
                console.log('문서 생성!', newDoc.doc._id);
                changeDocId(newDoc.doc._id);
                setIsEditing(true);
            }
            alert('문서 저장!');
        } catch (error) {
            console.error('Failed to create document', error);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        console.log('선택된 카테고리:', e.target.value);
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="docView-background">
            <div className="doc-bookcase">
                <div className="doc-container">
                    <div className="title-container">
                        <div className="title">title: </div>
                        <input
                            className="title-box textBox"
                            type="text"
                            defaultValue={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요!"
                        />
                        <div>category: </div>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            {categoriesList()}
                        </select>
                    </div>
                    <div className="content">
                        <textarea
                            className="content-box textBox"
                            placeholder='글을 작성하세요.'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="actions">
                        <button onClick={() => handleDocData().then(() => console.log('저장 완료!'))}>저장</button>
                        <button onClick={() => handleDeleteDoc(token, docId).then(() => goToLibrary())}>삭제</button>
                        <button onClick={() => goToLibrary()}>뒤로가기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docview;
