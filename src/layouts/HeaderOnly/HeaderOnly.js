import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '../components/Header';
import styles from './HeaderOnly.module.scss'

import { UserAuth } from '../../components/Store/AuthContext';
import UploadAvatar from '~/components/Auth/UploadAvatar';
import LogOut from '../../components/Auth/LogOut';
import FormUpdate from '../../components/Auth/UpdateForm';
import AuthForm from '../../components/Auth';
import Notify from '~/components/Notify'
import Login from '../../components/Auth/Login';
import PlayMusic from '~/components/PlayMusic';

const cx = classNames.bind(styles)

function HeaderOnly({children}) {
    const {openFormEdit,openFormAvatar,openFormLogout,openFormLogin} = UserAuth();

    useEffect(() => {
        document.body.style =
         openFormEdit || openFormAvatar ||openFormLogout ||openFormLogin
                ? 'overflow-y: hidden'
                : 'overflow-y: overlay';
    }, [ openFormEdit,openFormAvatar,openFormLogout,openFormLogin]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                
                <div className={cx('content')}>{children}</div>
 
            </div>
            {(openFormEdit || openFormAvatar || openFormLogout || openFormLogin) && (
                <AuthForm>
                    {openFormEdit && <FormUpdate />}
                    {openFormAvatar && <UploadAvatar />}
                    {openFormLogout && <LogOut />}
                    {openFormLogin && <Login/>}
                </AuthForm>
            )}
            <div className={cx('play-music')}>
                <PlayMusic />
            </div>
            <Notify />
        </div>
    );
}

HeaderOnly.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeaderOnly;