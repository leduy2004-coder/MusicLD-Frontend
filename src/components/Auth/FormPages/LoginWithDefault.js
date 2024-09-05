import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './FormPages.module.scss';

import { HidePassIcon, ShowPassIcon } from '~/components/Icons';
import { UserNotify } from '../../Store';
import Button from '../../Button';
import config from '~/services';

const cx = classNames.bind(styles);

function LoginWithDefault() {
    const [disabledSubmitted, setDisabledSubmited] = useState(false);
    const [valueAccount, setValueAccount] = useState('');
    const [valuePassword, setValuePassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setInfoNotify } = UserNotify();

    const handleChangeValueAccount = (e) => {
        if (e.target.value.startsWith(' ')) {
            return;
        }

        setValueAccount(e.target.value);
    };

    const handleChangeValuePassword = (e) => {
        if (e.target.value.startsWith(' ')) {
            return;
        }

        setValuePassword(e.target.value);
    };

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = await config.login(valueAccount, valuePassword);

        if (data.errCode) {
            setInfoNotify({
                content: 'Đăng nhập thất bại. Hãy thử lại !!',
                delay: 1500,
                isNotify: true,
                type: 'error'
            });

            setTimeout(() => {
                setIsLoading(false);
            }, [300]);
        } else {
            setInfoNotify({
                content: 'Đăng nhập thành công',
                delay: 1500,
                isNotify: true,
                type: 'success'
            });
    
            localStorage.setItem('user-id', JSON.stringify(data.result.userResponse));
            localStorage.setItem('access_token', JSON.stringify(`Bearer ${data.result.access_token}`));
            localStorage.setItem('refresh_token', JSON.stringify(`Bearer ${data.result.refresh_token}`));
            localStorage.setItem('avatar', JSON.stringify(data.result.userResponse.avatar));

            
            setTimeout(() => {
                setIsLoading(false);
                window.location.reload();
            }, [300]);
        }
    };

    useEffect(() => {
        if (valueAccount.length === 0 || valuePassword.length === 0) {
            setDisabledSubmited(true);
        } else {
            setDisabledSubmited(false);
        }
    }, [valueAccount, valuePassword]);

    return (
        <form action="" method="POST" className={cx('login-inner')}>
            <h1 className={cx('title')}>Đăng nhập</h1>
            <div className={cx('form')}>
                <div className={cx('des-form')}>
                    <p className={cx('type')}>Tài khoản</p>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            value={valueAccount}
                            onChange={handleChangeValueAccount}
                            type="text"
                            placeholder="Số điện thoại / Email"
                        />
                    </div>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            value={valuePassword}
                            onChange={handleChangeValuePassword}
                            type={showPass ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            autoComplete="on"
                        />
                        <div className={cx('control-pass')} onClick={handleShowPass}>
                            {showPass ? <ShowPassIcon /> : <HidePassIcon />}
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('forgot')}>
                <span>Quên mật khẩu ?</span>
            </div>
            <Button
                className={cx('btn-submit')}
                onClick={handleLogin}
                disabled={disabledSubmitted ? true : false}
                type="submit"
                primary
                large
            >
                {isLoading ? <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> : <span>Đăng nhập</span>}
            </Button>
        </form>
    );
}

export default LoginWithDefault;
