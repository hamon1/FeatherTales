import { deleteDoc } from '../api';

// 문서 삭제 후 목록을 갱신하는 유틸
// Library.js와 Docview.js에서 공통으로 사용
export const handleDeleteDoc = async (token, docId) => {
    console.log('handleDeleteDoc', docId);
    try {
        const deletedDoc = await deleteDoc(token, docId);
        console.log('Document deleted!', deletedDoc);
    } catch (error) {
        console.error('Failed to delete document', error.response.data.msg);
    }
};
