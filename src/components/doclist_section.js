import React from 'react';
import { useNavigation } from '../utils/navigate';


const Doclist_section = ({data}) => {
    const { goToDocview } = useNavigation();

    const handleClick = (docId) => {
        console.log('Document ID:', docId);
        goToDocview(docId);
    }

    return (
        <div class="shelf">
                    <div class="book">
                        <div class="cover">
                            {/* <img src="book_cover.jpg" alt="book cover" /> */}
                        </div>
                        <div class="title">{data.title}</div>
                        <div class="actions">
                            <button onClick={()=>handleClick(data.docid)}>수정</button>
                            <button onClick={()=>alert('doc 삭제!')}>삭제</button>
                        </div>
                    </div>
                </div>
    )
}
export default Doclist_section;