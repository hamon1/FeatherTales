import React, { createContext, useState } from 'react';

// 문서 목록을 전역 상태로 관리 (현재는 주로 TanStack Query로 대체됨)
export const DocsContext = createContext();

export const DocsProvider = ({ children }) => {
    const [docs, setDocs] = useState([]);

    return (
        <DocsContext.Provider value={{ docs, setDocs }}>
            {children}
        </DocsContext.Provider>
    );
};
