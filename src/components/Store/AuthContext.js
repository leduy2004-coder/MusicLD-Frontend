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
    const [openFormChangePass, setOpenFormChangePass] = useState(false);
    const [openFullVideo, setOpenFullVideo] = useState(false);
    const [openFormDelete, setOpenFormDelete] = useState(false);
    const [openFormAvatar, setOpenFormAvatar] = useState(false);
    const [openFormNotifyPayment, setOpenFormNotifyPayment] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [dataForm, setDataForm] = useState({});
    const [tokenStr, setTokenStr] = useState(() => {
        const token = localStorage.getItem('access_token');
        return token ? JSON.parse(token) : ''; // default to '' if the token doesn't exist
    });

    const userAuth = (() => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : {}; // default to empty object if the user doesn't exist
        } catch (error) {
            return {}; // return empty object in case of an error while parsing
        }
    })();

    const avatar = (() => {
        try {
            const avatarData = localStorage.getItem('avatar');
            return avatarData ? JSON.parse(avatarData) : {}; // default to empty object if the avatar doesn't exist
        } catch (error) {
            return {}; // return empty object in case of an error while parsing
        }
    })();

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
        openFormChangePass,
        setOpenFormChangePass,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
