import { api, createDoc, updateDoc, deleteDoc, searchDocs, getDocs } from '../api';

export const handleDeleteDoc = async (token, docId) => {
    console.log('handleDeleteDoc', docId);
        try {
            console.log('boob');
            const deletedDoc = await deleteDoc(token, docId);
            console.log('Document deleted!', deletedDoc);
            
            // setDocs((prevDocs) => {
            //     const updateDocs = prevDocs.filter((doc) => doc.docid !== docId);
            //     console.log('doc updated!');
            //     return updateDocs;
            // })
            // setDocs((prevDocs) => prevDocs.filter((doc) => doc.docid !== docId));

        } catch (error) {
            console.error('Failed to delete document', error.response.data.msg);
        }
}