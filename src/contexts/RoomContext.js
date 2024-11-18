import React, { createContext, useState } from 'react';

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState(null);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    )
}