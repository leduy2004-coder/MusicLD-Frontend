import {useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { DatePicker, Select } from 'antd'; // Import Select từ Ant Design
import moment from 'moment';

import styles from './FormPages.module.scss';
import { HidePassIcon, ShowPassIcon } from '~/components/Icons';
import { UserNotify } from '../../Store';
import Button from '../../Button';
import config from '~/services';

const cx = classNames.bind(styles);
const { Option } = Select; // Khai báo Option từ Select

function RegisterWithDefault() {
    const [disabledSubmitted, setDisabledSubmited] = useState(false);
    const [formValues, setFormValues] = useState({
        account: '',
        password: '',
        nickName: '',
        date: '',
        gender: '', // Thêm trường giới tính vào state
    });
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setInfoNotify } = UserNotify();

    const handleChange = useCallback((name, value) => {
        // Hàm này sẽ nhận tên trường và giá trị mới
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
        const { account, password, nickName, date, gender } = formValues; // Bao gồm cả gender
        const data = await config.register(account, password, nickName, date, gender, 'USER');

        if (data.errCode) {
            setInfoNotify({
                content: 'Đăng kí thất bại. Vui lòng thử lại !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });

            setTimeout(() => {
                setIsLoading(false);
            }, [300]);
        } else {
            setInfoNotify({
                content: 'Đăng kí thành công',
                delay: 1500,
                isNotify: true,
                type: 'success',
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
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                            name="nickName"
                            value={formValues.nickName}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            type="text"
                            placeholder="Tên người dùng"
                        />
                    </div>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <DatePicker
                            value={formValues.date ? moment(formValues.date, 'DD/MM/YYYY') : null}
                            onChange={(date, dateString) => handleChange('date', dateString)}
                            format="DD/MM/YYYY" 
                            placeholder="Ngày tháng năm sinh"
                            className={cx('date-picker')}
                        />
                    </div>
                </div>
                <div className={cx('container-form')}>
                    <div className={cx('form-input')}>
                        <Select
                            placeholder="Giới tính"
                            value={formValues.gender}
                            onChange={(value) => handleChange('gender', value)} 
                            className={cx('select-gender')}
                        >
                            <Option value="true">Nam</Option>
                            <Option value="false">Nữ</Option>
                
                        </Select>
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
