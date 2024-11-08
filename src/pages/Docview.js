import React, {useState, useEffect, useContext} from 'react';
import { api, createDoc, updateDoc, getDocsbyDocId } from '../api';
import { UserContext } from '../contexts/UserContext';

import { useNavigation } from '../utils/navigate';
import { useParams } from 'react-router-dom';

const Docview = () => {
    // console.log(docId);
    const {docId} = useParams();
    const { goToHome, goToLibrary } = useNavigation();
    
    const { user, setUser } = useContext(UserContext); // use UserContext to get user and token.

    const [docData, setDocData] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const token = sessionStorage.getItem('token');

    console.log(token);

    useEffect(() => {
        if(docId) {
            setIsEditing(true);
            const fetchDocData = async () => {
                console.log('Fetching');
                try {
                    const data = await getDocsbyDocId(token, docId);
                    console.log(data);
                    setTitle(data.document.title);
                    setContent(data.document.content);
                } catch (error) {
                    console.error('Failed to fetch document', error.response.data.msg);
                }
            };
            fetchDocData();
        }
    }, [docId, token]);
    
    
    const handleDocData = async () => {
        const data = {
            userid: user.userid,
            title: title,
            content: content,
        };
        try {
            if (isEditing) {
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

    return (
        <div>
            <h1>Documentation Page</h1>
            {/* <button onClick={() => goToHome()}>Home</button>  // useNavigation Hook instead of useNavigate() function to navigate to Home page. */}
            <div class="doc-container">
                <div class="title-container">
                    <div class="title">title: {title}</div>
                    <input 
                        type="text"
                        defaultValue={title}
                        onChange={(e) => setTitle(e.target.value)}

                    >
                        
                    </input>
                </div>
                <div class="content">
                    <input 
                    type="text"
                    defaultValue={content}
                    onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div class="actions">
                    <button onClick={() => handleDocData().then(console.log('저장 완료!'))}>저장</button>
                    <button onClick={() => alert('doc 삭제!')}>삭제</button>
                    <button onClick={() => goToLibrary()}>뒤로가기</button>
                </div>
            </div>
        </div>
    )
}

export default Docview;