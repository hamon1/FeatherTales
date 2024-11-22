import React, {useState, useEffect, useContext} from 'react';
import { api, createDoc, updateDoc, getDocsbyDocId } from '../api';
import { UserContext } from '../contexts/UserContext';
// import { UserService } from '../services/UserService';

import { useNavigation } from '../utils/navigate';
import { useParams } from 'react-router-dom';

import { handleDeleteDoc } from '../utils/docUtils';
import { DocsContext } from '../contexts/DocContext';

const Docview = () => {
    // console.log(docId);
    const {docId} = useParams();
    const { goToHome, goToLibrary } = useNavigation();
    
    const { user, setUser } = useContext(UserContext); // use UserContext to get user and token.
    const { docs, setDocs } = useContext(DocsContext); // use DocsContext to

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
    }, [docId, token]);
    
    
    const handleDocData = async () => {
        console.log(isEditing);
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
                    <button onClick={() => handleDeleteDoc(token, docId, setDocs).then(goToLibrary())}>삭제</button>
                    <button onClick={() => goToLibrary()}>뒤로가기</button>
                </div>
            </div>
        </div>
    )
}

export default Docview;