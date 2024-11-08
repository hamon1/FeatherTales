import React, { useState, useContext, useEffect } from 'react';
import { api, createDoc, updateDoc, deleteDoc, searchDocs, getDocs } from '../api';
import { useNavigation } from '../utils/navigate';
import { UserContext } from '../contexts/UserContext';

import Doclist_section from '../components/doclist_section';
import LoadingPage from './LoadingPage';


const Library = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { user, setUser } = useContext(UserContext);
    const { goToDocview } = useNavigation();
    const [docs, setDocs] = useState([
        // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
    
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setIsLoading(false);
            console.log(user.userid);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    useEffect(() => {
        const fetchDocs = async() => {
            try{
                const data = await getDocs(token, user.userid);
                console.log(data.documents.length);
                setDocs(data.documents);
            } catch (error) {
                console.error('Failed to fetch documents', error.response.data.msg);
            }
        };

        if (user && user.userid) {
            fetchDocs();
        }
    }, [user]);
    
    const handleCreateDoc = async (docData) => {
        // getDocs(token, user.userid);

        goToDocview();
    }

    function docListComponent(docData) {
        const len = docData.length;
        if (len === 0) {
            return <p>No documents yet</p>;
        }
        let docItems = [];
        for (let i = 0; i < docData.length; i++) {
            console.log('1' + docData[i].title);
            docItems.push(<Doclist_section data={docData[i]}/>);
        }
        return docItems;
    }


    return (
        <>
        {isLoading ? (
            <LoadingPage isLoading={isLoading}/>
        ):
        <div>
            <h1>Library Page</h1>
            <div>
                <button onClick={()=> handleCreateDoc()}>+</button>
            </div>
            <div>
            <div class="avatar library">
                    <p>avatar</p>
                </div>
            </div>
            <div class="bookcase">
                {docListComponent(docs)}
            </div>
        </div>
    }
    </>
    )
}

export default Library;