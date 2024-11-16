import React, { createContext, useContext, useState, useEffect } from 'react';


const ChatContext = createContext();

// Tạo provider để cung cấp publicChats và các phương thức
export const ChatProvider = ({ children }) => {
    const [publicChats, setPublicChats] = useState(() => {
        const savedChats = localStorage.getItem('publicChats');
        return savedChats ? JSON.parse(savedChats) : [];
    });

    const getUnreadCount = () => {
        return publicChats.filter(chat => chat.read === false).length;
    };


    return (
        <ChatContext.Provider value={{ publicChats, setPublicChats, getUnreadCount }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useChat = () => {
    return useContext(ChatContext);
};
