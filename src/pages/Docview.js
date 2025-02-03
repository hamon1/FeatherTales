import React, {useState, useEffect, useContext} from 'react';
import { api, createDoc, updateDoc, getDocsbyDocId } from '../api';
import { UserContext } from '../contexts/UserContext';
// import { UserService } from '../services/UserService';


import { useUserQuery } from '../hooks/useUserQuery';

import { useDocumentQuery } from "../hooks/useDocumentQuery";


import { useNavigation } from '../utils/navigate';
import { useParams } from 'react-router-dom';

import { handleDeleteDoc } from '../utils/docUtils';
import { DocsContext } from '../contexts/DocContext';

const Docview = () => {
    const {docId} = useParams();
    console.log(docId);
    const { goToHome, goToLibrary } = useNavigation();
    
    const { data: user, isLoading, error} = useUserQuery();

    const { data: docs } = useDocumentQuery();
    // const { user, setUser } = useContext(UserContext); // use UserContext to get user and token.
    // const { docs, setDocs } = useContext(DocsContext); // use DocsContext to

    const [categories, setCategories] = useState([]);

    const [docData, setDocData] = useState('');
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [content, setContent] = useState('');
    // const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const token = sessionStorage.getItem('token');

    console.log(token);

    useEffect(() => {
        if(user) {
            setCategories(user.categories);
            setSelectedCategory(user.categories[0]?.type || '');
        }
    }, [user]);

    const categoriesList = () => {
        console.log(categories.length);
        console.log('categories: ', categories);
        if (categories) {
            return categories.map((categoryItem, index) => (
                <>
                    {/* <div key={`div-${index}`}>{categoryItem.type}?</div> */}
                    <option key={`option-${index}`} value={categoryItem.type}>{categoryItem.type}</option>
                </>
            ));
        } else {
            return <option value="">카테고리를 선택하세요.</option>;
        }
    }

    useEffect(() => {
        console.log("fetching", docId);
        if(docId) {
            setIsEditing(true);
            const fetchDocData = async () => {
                console.log('Fetching');
                try {
                    const data = await getDocsbyDocId(token, docId);
                    console.log('docs data: ', data);
                    
                    if (data) {
                        setIsEditing(true);
                        setTitle(data.document.title);
                        console.log('title: ', data.document.title);
                        setContent(data.document.content);
                    } else {
                        setIsEditing(false);
                    }


                } catch (error) {
                    console.error('Failed to fetch document', error.response.data.msg);
                }
            };
            fetchDocData();
            
        }
    }, []);
    
    
    const handleDocData = async () => {
        console.log(isEditing);
        console.log(selectedCategory);
        const data = {
            userid: user.userid,
            title: title,
            category: selectedCategory,
            content: content,
        };
        console.log('update: ', docId);
        try {
            if (!docId) {
                await updateDoc(token, docId, data);
                console.log('문서 수정!');
            } else {
                await createDoc(token, data);
                console.log('문서 생성!');
            }
        } catch (error) {
            console.error('Failed to create document', error.response.data.msg);
        }

    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value); // 선택된 값 업데이트
        console.log('선택된 카테고리:', e.target.value);
    };

    return (
        <div class="docView-background">
            {/* <h1>Documentation Page</h1> */}
            {/* <button onClick={() => goToHome()}>Home</button>  // useNavigation Hook instead of useNavigate() function to navigate to Home page. */}
            <div class="doc-container">
                <div class="title-container">
                    <div class="title">title: </div>
                    <input 
                        class="title-box textBox"
                        type="text"
                        defaultValue={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요!"
                    >
                    </input>
                    <div>category: </div>
                    <select 
                        id="category" 
                        value={selectedCategory} // 현재 선택된 값
                        onChange={handleCategoryChange}
                    >
                        {categoriesList()}

                    </select>
                </div>
                <div class="content">
                    {/* <input 
                        class="content-box textBox"
                    type="text"
                    defaultValue={content}
                    onChange={(e) => setContent(e.target.value)}
                /> */}
                    <textarea 
                    class="content-box textBox"
                    placeholder='글을 작성하세요.'
                    value={content}  // if you want to use the content state, you should add this line.
                    onChange={(e) => setContent(e.target.value)}
                    
                    >

                    </textarea>
                    </div>
                <div class="actions">
                    <button onClick={() => handleDocData().then(console.log('저장 완료!'))}>저장</button>
                    <button onClick={() => handleDeleteDoc(token, docId).then(goToLibrary())}>삭제</button>
                    <button onClick={() => goToLibrary()}>뒤로가기</button>
                </div>
            </div>
        </div>
    )
}

export default Docview;