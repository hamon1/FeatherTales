import React, { createContext, useState } from 'react';

// 사용자의 방(Room) 데이터(오브젝트 위치 등)를 전역 상태로 관리
export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState(null);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
