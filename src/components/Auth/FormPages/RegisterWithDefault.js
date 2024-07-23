import { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './FormPages.module.scss';

import { HidePassIcon, ShowPassIcon } from '~/components/Icons';
import { UserNotify } from '../../Store';
import Button from '../../Button';
import config from '~/services';

const cx = classNames.bind(styles);

function RegisterWithDefault() {
    const [disabledSubmitted, setDisabledSubmited] = useState(false);
    const [formValues, setFormValues] = useState({
        account: '',
        password: '',
        fullName: '',
        date: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setInfoNotify } = UserNotify();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        if (value.startsWith(' ')) return;

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }, []);

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { account, password,fullName,date } = formValues;
        const data = await config.register(account, password,fullName,date,'USER');

        if (data.errCode) {
            setInfoNotify({
                content: 'Đăng kí thất bại. Vui lòng thử lại !!',
                delay: 1500,
                isNotify: true,
            });

            setTimeout(() => {
                setIsLoading(false);
            }, [300]);
        } else {
            setInfoNotify({
                content: 'Đăng kí thành công',
                delay: 1500,
                isNotify: true,
            });

            localStorage.setItem('user-id', JSON.stringify(data.result.userResponse));
            localStorage.setItem('token', JSON.stringify(`Bearer ${data.result.access_token}`));

            setTimeout(() => {
                setIsLoading(false);
                window.location.reload();
            }, [300]);
        }
    };

    useEffect(() => {
        const { account, password, fullName, date } = formValues;
        setDisabledSubmited(!account || !password || !fullName || !date);
    }, [formValues]);

    return (
        <form action="" method="POST" className={cx('login-inner')}>
            <h1 className={cx('title')}>Đăng kí</h1>
            <div className={cx('form')}>
                <div className={cx('des-form')}>
                    <p className={cx('type')}>Tài khoản</p>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            name="account"
                            value={formValues.account}
                            onChange={handleChange}
                            type="text"
                            placeholder="Số điện thoại / Email"
                        />
                    </div>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            type={showPass ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            autoComplete="on"
                        />
                        <div className={cx('control-pass')} onClick={handleShowPass}>
                            {showPass ? <ShowPassIcon /> : <HidePassIcon />}
                        </div>
                    </div>
                </div>
                <div className={cx('des-form')}>
                    <p className={cx('type')}>Thông tin</p>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            name="fullName"
                            value={formValues.fullName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Tên đầy đủ"
                        />
                    </div>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <input
                            name="date"
                            value={formValues.date}
                            onChange={handleChange}
                            type="date"
                            placeholder="Ngày tháng năm sinh"
                        />
                    </div>
                </div>
            </div>
            <Button
                className={cx('btn-submit')}
                onClick={handleRegister}
                disabled={disabledSubmitted ? true : false}
                type="submit"
                primary
                large
            >
                {isLoading ? <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> : <span>Đăng kí</span>}
            </Button>
        </form>
    );
}

export default RegisterWithDefault;
