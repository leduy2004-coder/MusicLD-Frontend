import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

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
    const [openFormDiscard, setOpenFormDiscard] = useState(false);
    const [dataForm, setDataForm] = useState({});

    const [tokenStr, setTokenStr] = useState('');
    const [userAuth, setUserAuth] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('user-id');
        
        setTokenStr(storedToken && isJSON(storedToken) ? JSON.parse(storedToken) : '');
        setUserAuth(storedUserId && isJSON(storedUserId) ? JSON.parse(storedUserId) : '');
    }, []);

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
        setDataForm,
        openFormDiscard,
        setOpenFormDiscard,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
