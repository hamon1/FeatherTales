import React, { createContext, useState } from 'react';

export const DocsContext = createContext();

export const DocsProvider = ({ children }) => {
    const [docs, setDocs] = useState([]);

    return (
        <DocsContext.Provider value={{ docs, setDocs }}>
            {children}
        </DocsContext.Provider>
    )
}