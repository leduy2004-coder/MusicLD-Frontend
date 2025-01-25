import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { Modal, message, Input, DatePicker, Select } from 'antd'; // Import Select từ Ant Design
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
        email: '',
        account: '',
        password: '',
        nickName: '',
        date: '',
        gender: '', // Thêm trường giới tính vào state
    });
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');

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
        // Kiểm tra xem tất cả các trường bắt buộc đã được điền hay chưa
        const { email, account, password, nickName, date, gender } = formValues;

        if (!email || !account || !password || !nickName || !date || !gender) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        setIsLoading(true);

        // Gửi OTP qua email
        const otpResponse = await config.generateOtp(email);
        if (otpResponse.errCode) {
            message.error('Gửi mã OTP thất bại. Vui lòng thử lại!');
            setIsLoading(false);
            return;
        }
        setInfoNotify({
            content: 'Đã gửi mã vào mail của bạn !!',
            delay: 1300,
            isNotify: true,
            type: 'success',
        });
        // Hiển thị modal nhập OTP
        setIsOtpModalVisible(true);
        setIsLoading(false);
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);

        const { email, account, password, nickName, date, gender } = formValues;
        const verifyResponse = await config.verifyAccount(email, otp);
        if (verifyResponse.errorCode === 1019) {
            message.error('Mã OTP đã hết hạn!');
            setIsLoading(false);
            setIsOtpModalVisible(false);
            return;
        }
        if (verifyResponse.result === false) {
            message.error('Mã OTP không chính xác!');
            setIsLoading(false);
            return;
        }
        // Hoàn tất đăng ký sau khi OTP được xác minh
        const data = await config.register(email, account, password, nickName, date, gender, 'USER');
        if (data.errCode) {
            setInfoNotify({
                content: 'Đăng ký thất bại. Vui lòng thử lại!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        } else {
            setInfoNotify({
                content: 'Đăng ký thành công!',
                delay: 1500,
                isNotify: true,
                type: 'success',
            });

            localStorage.setItem('user', JSON.stringify(data.result.userResponse));
            localStorage.setItem('access_token', JSON.stringify(`Bearer ${data.result.access_token}`));
            localStorage.setItem('refresh_token', JSON.stringify(`Bearer ${data.result.refresh_token}`));
            localStorage.setItem('avatar', JSON.stringify(data.result.userResponse.avatar));

            setTimeout(() => {
                window.location.reload();
            }, 300);
        }

        setIsLoading(false);
        setIsOtpModalVisible(false);
    };

    return (
        <>
            <form action="" method="POST" className={cx('login-inner')}>
                <h1 className={cx('title')}>Đăng kí</h1>
                <div className={cx('form')}>
                    <div className={cx('des-form')}>
                        <p className={cx('type')}>Tài khoản</p>
                    </div>
                    <div className={cx('container-form')}>
                        <div className={cx('form-input')}>
                            <input
                                name="email"
                                value={formValues.email}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                type="text"
                                placeholder="Email"
                                required
                            />
                        </div>
                    </div>
                    <div className={cx('container-form')}>
                        <div className={cx('form-input')}>
                            <input
                                name="account"
                                value={formValues.account}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                type="text"
                                placeholder="Tài khoản"
                                required
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
                                required
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
                                required
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
                <div className={cx('required')}>Vui lòng điền đầy đủ thông tin</div>
            </form>

            {/* Modal nhập OTP */}
            <Modal
                title="Nhập mã OTP"
                visible={isOtpModalVisible}
                onOk={handleVerifyOtp}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={isLoading}
                onCancel={() => setIsOtpModalVisible(false)}
                maskClosable={false} // Ngăn đóng modal khi nhấn ra bên ngoài
            >
                <p>Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email của bạn:</p>
                <Input placeholder="Nhập mã OTP" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
            </Modal>
        </>
    );
}

export default RegisterWithDefault;
