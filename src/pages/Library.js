import React, { useState, useContext, useEffect } from 'react';
import { api, createDoc, updateDoc, deleteDoc, searchDocs, getDocs, addCategory, getCategories } from '../api';
import { useNavigation } from '../utils/navigate';
import { UserContext } from '../contexts/UserContext';
import { DocsContext } from '../contexts/DocContext';

import Doclist_section from '../components/doclist_section';
import LoadingPage from './LoadingPage';

import { handleDeleteDoc } from '.././utils/docUtils';

const Library = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { user, setUser } = useContext(UserContext);
    const { docs, setDocs } = useContext(DocsContext); // use DocsContext to get docs.

    const [categories, setCategories] = useState([]);

    const [newCategory, setNewCategory] = useState('');

    const { goToDocview } = useNavigation();
    // const [docs, setDocs] = useState([
    //     // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    // ]);
    
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setIsLoading(false);
            // console.log(user);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    useEffect(() => {
        const fetchDocs = async() => {
            try{
                const data = await getDocs(token, user.userid);
                console.log('doc length: ', data.documents.length);
                setDocs(data.documents);
            } catch (error) {
                console.error('Failed to fetch documents', error.response.data.msg);
            }
        };

        if (user) {
            fetchDocs();
        }
    }, [user], [docs]);
    
    useEffect(() => {
        const fetchCategories = async() => {
            try{
                const data = await getCategories(token, user.userid);
                console.log('categories: ', data);
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error.response.data.msg);
            }
        };

        fetchCategories();
    }, [user])

    const handleCreateDoc = async (docData) => {
        // getDocs(token, user.userid);

        goToDocview();
    }

    // const handleDeleteDoc = async (docId) => {
    //     console.log('handleDeleteDoc', docId);
    //     try {
    //         console.log('boob');
    //         const deletedDoc = await deleteDoc(token, docId);
    //         console.log('Document deleted!', deletedDoc);
            
    //         setDocs((prevDocs) => {
    //             const updateDocs = prevDocs.filter((doc) => doc.docid !== docId);
    //             console.log('doc updated!');
    //             return updateDocs;
    //         })
    //     } catch (error) {
    //         console.error('Failed to delete document', error.response.data.msg);
    //     }
    // }

    function docListComponent(docData) {
        const len = docData.length;
        if (len === 0) {
            return <p>No documents yet</p>;
        }
        // let docItems = [];
        // for (let i = 0; i < docData.length; i++) {
        //     console.log('1' + docData[i].title);
        //     docItems.push(<Doclist_section data={docData[i]}/>);
        // }
        // return docItems;
        return docData.map(doc => (
            <Doclist_section 
                key= {doc.docid}
                data={doc}
                onDelete={() => handleDeleteDoc(token, doc.docid, setDocs)}
            />
        ))
    }

    const categoriesList = (categories) => {
        if (categories.length === 0) {
            return <p>No categories yet</p>;
        }
        return categories.map((category, index) => (
            <div key={index}>{category}</div>
        ))
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
                    {docListComponent(docs)}
                </div>
            </div>
                <div class="tags-container">
                    <div class="add-category">
                        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}/>
                        <button onClick={() => addCategory(token, newCategory)}>카테고리 추가</button>
                    </div>
                    {/* <button>전체</button> */}
                    {categoriesList(categories)}
                </div>
        </div>
    }
    </>
    )
}

export default Library;