import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import config from '~/services';
const AuthContext = React.createContext();

export function UserAuth() {
    return useContext(AuthContext);
}

const isJSON = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export function AuthProvider({ children }) {
    const [isFollowed, setIsFollowed] = useState(false);
    const [openFormLogin, setOpenFormLogin] = useState(false);
    const [openFormLogout, setOpenFormLogout] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [openFullVideo, setOpenFullVideo] = useState(false);
    const [openFormDelete, setOpenFormDelete] = useState(false);
    const [openFormAvatar, setOpenFormAvatar] = useState(false);
    const [dataForm, setDataForm] = useState({});

    const [tokenStr, setTokenStr] = useState('');
    const [userAuth, setUserAuth] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('user-id');
        const avatarUser = localStorage.getItem('avatar');
        
        setTokenStr(storedToken && isJSON(storedToken) ? JSON.parse(storedToken) : '');
        setUserAuth(storedUserId && isJSON(storedUserId) ? JSON.parse(storedUserId) : '');
        setAvatar(avatarUser && isJSON(avatarUser) ? JSON.parse(avatarUser) : '');
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            if (avatar && !avatar.startsWith('data:image/png;base64,')) { 
                try {
                    const data = await config.getAvatar(avatar);
                    const base64Image = `data:image/png;base64,${data}`;
                    if (avatar !== base64Image) { 
                        setAvatar(base64Image);
                    }
                } catch (error) {
                    console.error('Failed to load avatar', error);
                }
            }
        };
        fetchImage();
    }, [avatar]);

    const value = {
        isFollowed,
        setIsFollowed,
        openFormLogin,
        setOpenFormLogin,
        openFormLogout,
        setOpenFormLogout,
        openFormEdit,
        setOpenFormEdit,
        openFullVideo,
        setOpenFullVideo,
        openFormDelete,
        setOpenFormDelete,
        tokenStr,
        userAuth,
        dataForm,
        avatar,
        setDataForm,
        openFormAvatar,
        setOpenFormAvatar,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
