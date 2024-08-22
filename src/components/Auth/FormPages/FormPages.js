import { Fragment, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './FormPages.module.scss';

import LoginWithDefault from './LoginWithDefault';
import RegisterWithDefault from './RegisterWithDefault';
import { FacebookIcon, GoogleIcon, PerSonIcon } from '~/components/Icons';
import { BackIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const data = [
    {
        icon: <FacebookIcon />,
        title: 'Tiếp tục với Facebook',
        to: 'http://localhost:8080/oauth2/authorization/facebook',
    },
    {
        icon: <GoogleIcon />,
        title: 'Tiếp tục với Google',
        to: 'http://localhost:8080/oauth2/authorization/google',
    },
];

const MENU_SIGNUP = {
    titleHeader: 'Đăng kí với MusicLD',
    data: [
        {
            icon: <PerSonIcon />,
            title: 'Số điện thoại / Email',
            children: {
                title: 'Log in',
                type: 'components',
                data: <RegisterWithDefault />,
            },
        },
        ...data,
    ],
    titleFooter: 'Bạn đã có tài khoản?',
    toLink: 'Đăng nhập',
};

const MENU_LOGIN = {
    titleHeader: 'Đăng nhập với MusicLD',
    data: [
        {
            icon: <PerSonIcon />,
            title: 'Số điện thoại / Email',
            children: {
                title: 'Log in',
                type: 'components',
                data: <LoginWithDefault />,
            },
        },
        ...data,
    ],
    policy: 'Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ của MusicLD và xác nhận rằng bạn đã đọc Chính sách quyền riêng tư của MusicLD.',
    titleFooter: 'Bạn chưa có tài khoản?',
    toLink: 'Đăng kí',
};

function FormPages() {
    const [isFormLogin, setIsFormLogin] = useState(true);
    const [convertForm, setConvertForm] = useState(false);
    const [form, setForm] = useState(null);

    const items = isFormLogin ? MENU_LOGIN : MENU_SIGNUP;

    const onChangeForm = () => {
        setConvertForm(false);
        setIsFormLogin(!isFormLogin);
    };

    const handleNextForm = (value) => {
        if (value.children) {
            setForm(value.children);
            setConvertForm(true);
        } else {
            localStorage.setItem('prev-href', window.location.href);
            window.location.href = value.to;
        }
    };

    const handleBackMenu = () => {
        setConvertForm(false);
    };

    return (
        <div className={cx('wrapper')}>
            {convertForm ? (
                <Fragment>
                    <div onClick={handleBackMenu} className={cx('back')}>
                        <BackIcon className={cx('back-btn')} />
                    </div>
                    {form.data}
                </Fragment>
            ) : (
                <Fragment>
                    <div className={cx('body')}>
                        <h1 className={cx('title')}>{items.titleHeader}</h1>
                        <div className={cx('main-form')}>
                            {items.data.map((value) => (
                                <button
                                    onClick={() => handleNextForm(value)}
                                    className={cx('channel-item')}
                                    key={value.title}
                                    disabled={value.disabled}
                                >
                                    <span className={cx('icon')}>{value.icon}</span>
                                    <p className={cx('text')}>{value.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={cx('policy')}>
                        <p className={cx('text-policy')}>{items.policy}</p>
                    </div>
                </Fragment>
            )}
            <div className={cx('footer-form')}>
                <p className={cx('advice')}>
                    {items.titleFooter}
                    <span onClick={onChangeForm} className={cx('to')}>
                        {items.toLink}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default FormPages;
