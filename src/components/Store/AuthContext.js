import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
const AuthContext = React.createContext();

export function UserAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isFollowed, setIsFollowed] = useState(false);
    const [openFormLogin, setOpenFormLogin] = useState(false);
    const [openFormLogout, setOpenFormLogout] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [openFullVideo, setOpenFullVideo] = useState(false);
    const [openFormDelete, setOpenFormDelete] = useState(false);
    const [openFormAvatar, setOpenFormAvatar] = useState(false);
    const [openFormNotifyPayment, setOpenFormNotifyPayment] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [dataForm, setDataForm] = useState({});
    const [tokenStr, setTokenStr] = useState(() => JSON.parse(localStorage.getItem('access_token')) ?? '');

    // const tokenStr = JSON.parse(localStorage.getItem('access_token')) ?? '';
    const userAuth = JSON.parse(localStorage.getItem('user')) ?? '';
    const avatar = JSON.parse(localStorage.getItem('avatar')) ?? '';

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
        setTokenStr,
        userAuth,
        dataForm,
        avatar,
        setDataForm,
        openFormAvatar,
        setOpenFormAvatar,
        openFormNotifyPayment,
        setOpenFormNotifyPayment,
        openMessage,
        setOpenMessage,
    };

    return (
        <AuthContext.Provider value={value}>
            {children} 
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
