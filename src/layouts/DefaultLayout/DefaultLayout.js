import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '../components/Header';
import styles from './DefaultLayout.module.scss';
import Sidebar from '../components/Sidebar';

import { UserAuth } from '../../components/Store/AuthContext';
import NotifyPayment from '~/components/Auth/NotifyPayment';
// import DiscardForm from '../../components/Auth/DiscardForm';
// import FormUpdate from '../../components/Auth/UpdateForm';
// import DeleteForm from '../../components/Auth/DeleteForm';
import LogOut from '../../components/Auth/LogOut';
import Login from '../../components/Auth/Login';
import AuthForm from '../../components/Auth';
import Notify from '~/components/Notify';
import WaitListMusic from '~/components/WaitListMusic';
import { UserMusic } from '~/components/Store';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const { isShow } = UserMusic();

    const {
        openFormLogin,
        openFormLogout,
        openFormEdit,
        openFullVideo,
        openFormDelete,
        openFormDiscard,
        openFormNotifyPayment,
    } = UserAuth();

    useEffect(() => {
        document.body.style =
            openFormLogin ||
            openFormLogout ||
            openFormEdit ||
            openFullVideo ||
            openFormDelete ||
            openFormDiscard ||
            openFormNotifyPayment
                ? 'overflow-y: hidden'
                : 'overflow-y: overlay';
    }, [
        openFormLogin,
        openFormLogout,
        openFormEdit,
        openFullVideo,
        openFormDelete,
        openFormDiscard,
        openFormNotifyPayment,
    ]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
                {isShow ? (
                    <div className={cx('side-right')}>
                        <WaitListMusic />
                    </div>
                ) : (
                    <div className={cx('side-right-hidden')}>
                        <WaitListMusic />
                    </div>
                )}
            </div>

            {(openFormLogin ||
                openFormLogout ||
                openFormEdit ||
                openFormDelete ||
                openFormDiscard ||
                openFormNotifyPayment) && (
                <AuthForm>
                    {openFormLogin && <Login />}
                    {openFormLogout && <LogOut />}
                    {openFormNotifyPayment && <NotifyPayment />}

                    {/* {openFormEdit && <FormUpdate />}
                    {openFormDelete && <DeleteForm />}
                    {openFormDiscard && <DiscardForm />} */}
                </AuthForm>
            )}

            <Notify />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
