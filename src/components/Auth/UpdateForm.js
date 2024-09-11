import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

import Button from '../Button';
import { Wrapper } from '../Popper';
import config from '~/services';
import { UserNotify } from '../Store';
import { UserAuth } from '../Store';
import { CloseTabs } from '../Control';

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const cx = classNames.bind(styles);

function UpdateForm() {
    const { userAuth, tokenStr, setOpenFormEdit } = UserAuth();
    const [form] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState(true);
    const { setInfoNotify } = UserNotify();

    // Thiết lập giá trị mặc định của form
    useEffect(() => {
        form.setFieldsValue({
            nickName: userAuth.nickName,
            gender: userAuth.gender === undefined ? undefined : userAuth.gender ? 'male' : 'female',
            dob: userAuth.dateOfBirth ? moment(userAuth.dateOfBirth, 'DD/MM/YYYY') : null,
        });
    }, [form, userAuth]);

    // Kiểm tra xem có sự thay đổi nào không
    const hasChanges = (values) => {
        return (
            values.nickName !== userAuth.nickName ||
            (values.gender === 'male' ? true : false) !== userAuth.gender || // Chuyển đổi lại thành true/false để so sánh
            (values.dob && values.dob.format('DD/MM/YYYY') !== userAuth.dateOfBirth)
        );
    };

    // Theo dõi sự thay đổi của form
    const onFormValuesChange = (changedValues, allValues) => {
        setIsDisabled(!hasChanges(allValues)); // Kích hoạt hoặc vô hiệu hóa nút "Lưu" dựa trên thay đổi
    };

    const handleUpdateUser = async (values) => {
        if (!hasChanges(values)) {
            return;
        }

        const data = await config.updateUser(
            tokenStr,
            values.nickName,
            values.gender === 'male', // Chuyển đổi lại thành true/false để lưu vào backend
            values.dob ? values.dob.format('DD/MM/YYYY') : null,
            userAuth.id,
        );
        if (data.errCode) {
            setInfoNotify({
                content: 'Cập nhật thất bại. Hãy thử lại !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        } else {
            setInfoNotify({
                content: 'Cập nhật thành công',
                delay: 1500,
                isNotify: true,
                type: 'success',
            });
            localStorage.setItem('user-id', JSON.stringify(data.result));
        }
        setTimeout(() => {
            window.location.reload();
        }, [300]);
    };

    const handleCloseForm = () => {
        setOpenFormEdit(false);
    };

    return (
        <div className={cx('form-wrapper')}>
            <section className={cx('modal-update')}>
                <Wrapper className={cx('main')}>
                    <header className={cx('header-update')}>
                        <h1 className={cx('header-title')}>Cập nhật thông tin</h1>
                        <div>
                            <CloseTabs onClick={handleCloseForm} />
                        </div>
                    </header>
                    <Form
                        {...formItemLayout}
                        form={form}
                        style={{
                            maxWidth: 800,
                            padding: '50px 0',
                        }}
                        onValuesChange={onFormValuesChange} // Gọi hàm khi giá trị form thay đổi
                        onFinish={handleUpdateUser}
                    >
                        <Form.Item label="NickName" name="nickName">
                            <Input />
                        </Form.Item>

                        <Form.Item name="gender" label="Giới tính">
                            <Select placeholder="Chọn giới tính" allowClear>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Ngày sinh" name="dob">
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 40,
                                span: 24,
                            }}
                        >
                            <div className={cx('footer-update')}>
                                <Button onClick={handleCloseForm} outline medium className={cx('btn-form-update')}>
                                    Thoát
                                </Button>
                                <Button
                                    htmlType="submit"
                                    disabled={isDisabled} // Vô hiệu hóa nút "Lưu" nếu không có thay đổi
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
        </div>
    );
}

export default UpdateForm;
