import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import React, { useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';

import Button from '../Button';
import { Wrapper } from '../Popper';
import config from '~/services';
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
    const [valueUserName, setValueUserName] = useState(userAuth.userName);
    const [valuePassword, setValuePassword] = useState(userAuth.password);
    const [valueNickName, setValueNickName] = useState(userAuth.nickName);
    const [valueGender, setValueGender] = useState(userAuth.gender);
    const [valueDob, setValueDob] = useState(userAuth.dateOfBirth);

    const handleUpdateUser = async () => {
        await config.update(tokenStr, valueUserName, valuePassword, valueNickName, valueGender, valueDob);
        window.location.reload();
    };

    const handleCloseForm = () => {
        setOpenFormEdit(false);
    };

    // Kiểm tra xem có sự thay đổi nào không
    const hasChanges =
        valueUserName !== userAuth.userName ||
        valuePassword !== userAuth.password ||
        valueNickName !== userAuth.nickName ||
        valueGender !== userAuth.gender ||
        (valueDob && valueDob.format('YYYY-MM-DD') !== userAuth.dateOfBirth?.format('YYYY-MM-DD'));

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
                        onFinish={handleUpdateUser}
                    >
                        <Form.Item label="Tên đăng nhập" name="userName" initialValue={valueUserName}>
                            <Input value={valueUserName} onChange={(e) => setValueUserName(e.target.value)} />
                        </Form.Item>

                        <Form.Item label="Mật khẩu" name="password" initialValue={valuePassword}>
                            <Input.Password
                                style={{ width: '100%' }}
                                value={valuePassword}
                                onChange={(e) => setValuePassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="NickName" name="nickName" initialValue={valueNickName}>
                            <Input value={valueNickName} onChange={(e) => setValueNickName(e.target.value)} />
                        </Form.Item>

                        <Form.Item name="gender" label="Giới tính" initialValue={valueGender}>
                            <Select placeholder="Chọn giới tính" onChange={(value) => setValueGender(value)} allowClear>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Ngày sinh" name="dob" initialValue={valueDob}>
                            <DatePicker value={valueDob} onChange={(date) => setValueDob(date)} />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                 
                        </Form.Item>
                    </Form>
                    <footer className={cx('footer-update')}>
                        <Button onClick={handleCloseForm} outline medium className={cx('btn-form-update')}>
                            Thoát
                        </Button>
                        <Button
                            onClick={handleUpdateUser}
                            disabled={!hasChanges} 
                            primary
                            medium
                            className={cx('btn-form-update')}
                        >
                            Lưu
                        </Button>
                    </footer>
                </Wrapper>
            </section>
        </div>
    );
}

export default UpdateForm;
