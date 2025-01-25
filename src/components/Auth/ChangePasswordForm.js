import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import React, { useState } from 'react';
import { Form, Input, Modal, message } from 'antd';

import Button from '../Button';
import { Wrapper } from '../Popper';
import { UserNotify } from '../Store';
import { UserAuth } from '../Store';
import { CloseTabs } from '../Control';
import config from '~/services';
const cx = classNames.bind(styles);

function ChangePasswordForm() {
    const { tokenStr, setOpenFormChangePass, userAuth } = UserAuth();
    const [form] = Form.useForm();
    const { setInfoNotify } = UserNotify();
    const [isDisabled, setIsDisabled] = useState(true);
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState(null);

    // Theo dõi sự thay đổi của form
    const onFormValuesChange = (_, allValues) => {
        const { currentPassword, newPassword, confirmPassword } = allValues;

        // Kích hoạt nút "Lưu" nếu tất cả trường hợp lệ
        setIsDisabled(!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword);
    };

    const handleUpdatePassword = async (values) => {
        const { newPassword, confirmPassword } = values;
        setFormValues(values);
        // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận không khớp
        if (newPassword !== confirmPassword) {
            setInfoNotify({
                content: 'Mật khẩu mới không khớp. Hãy thử lại!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
            return;
        }
        console.log(userAuth);
        // Gửi OTP qua email
        const otpResponse = await config.generateOtp(userAuth.email, 'CHANGE-PASSWORD');
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
    };

    const handleCloseForm = () => {
        setOpenFormChangePass(false);
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        // Gọi API xác minh OTP và xử lý kết quả

        const verifyResponse = await config.verifyAccount(null, otp, 'CHANGE-PASSWORD');
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
        // Gửi yêu cầu cập nhật mật khẩu
        const response = await config.changePassword(
            tokenStr,
            formValues.currentPassword,
            formValues.newPassword,
            formValues.confirmPassword,
        );

        if (response.errCode) {
            if (response.errCode === 1005) {
                setInfoNotify({
                    content: 'Tài khoản không tồn tại !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            }
            if (response.errCode === 1017) {
                setInfoNotify({
                    content: 'Mật khẩu sai vui lòng nhập lại !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            }
        } else {
            setInfoNotify({
                content: 'Đổi mật khẩu thành công!',
                delay: 1500,
                isNotify: true,
                type: 'success',
            });
            setIsLoading(false);

            setOpenFormChangePass(false);
        }
    };

    return (
        <div className={cx('form-wrapper')}>
            <section className={cx('modal-update')}>
                <Wrapper className={cx('main')}>
                    <header className={cx('header-update')}>
                        <h1 className={cx('header-title')}>Đổi mật khẩu</h1>
                        <div>
                            <CloseTabs onClick={handleCloseForm} />
                        </div>
                    </header>
                    <Form
                        form={form}
                        style={{
                            maxWidth: 800,
                            padding: '50px 50px',
                        }}
                        layout="vertical"
                        onValuesChange={onFormValuesChange}
                        onFinish={handleUpdatePassword}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu hiện tại!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu mới phải có ít nhất 6 ký tự!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            label="Nhập lại mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu mới!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <div className={cx('footer-update')}>
                                <Button onClick={handleCloseForm} outline medium className={cx('btn-form-update')}>
                                    Thoát
                                </Button>
                                <Button
                                    htmlType="submit"
                                    disabled={isDisabled}
                                    primary
                                    medium
                                    className={cx('btn-form-update')}
                                >
                                    Lưu
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Wrapper>
            </section>

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
        </div>
    );
}

export default ChangePasswordForm;
