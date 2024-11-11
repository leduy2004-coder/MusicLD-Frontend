import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Typography, Radio } from 'antd';
import classNames from 'classnames/bind';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './UploadForm.module.scss';
import { UserNotify } from '../Store';
import { useFormContext } from '../Store/FormContext';
import { UserAuth } from '../Store/AuthContext';
import config from '~/services';

const { TextArea } = Input;
const { Title } = Typography;
const cx = classNames.bind(styles);

function UploadForm() {
    const { saveFormData, resetFormData, formData } = useFormContext();
    const [form] = Form.useForm();
    const [avatarList, setAvatarList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const { setInfoNotify } = UserNotify();
    const { tokenStr, setOpenFormNotifyPayment, userAuth } = UserAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isStatus, setIsStatus] = useState(false);

    useEffect(() => {
        console.log(formData);
        const initializeFormData = async () => {
            if (formData.songName !== '' && !isStatus) {
                form.setFieldsValue({
                    songName: formData.songName,
                    lyrics: formData.lyrics,
                    access: formData.access,
                });
                if (formData.avatar) {
                    setAvatarList([formData.avatar]);
                }
                if (formData.file) {
                    setFileList([formData.file]);
                }
                try {
                    setInfoNotify({
                        content: 'Đang đăng nhạc vui lòng chờ !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'success',
                    });
                    setIsLoading(true);

                    const data = await config.uploadMusic(formData, tokenStr);
                    if (data.errorCode) {
                        handleUploadError(data.errorCode.data.code);
                    } else {
                        setInfoNotify({
                            content: 'Đăng nhạc thành công',
                            delay: 1500,
                            isNotify: true,
                            type: 'success',
                        });
                    }
                    form.resetFields();
                    setAvatarList([]);
                    setFileList([]);
                } catch (error) {
                    setInfoNotify({
                        content: 'Có lỗi xảy ra. Vui lòng thử lại sau!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                }
                resetFormData();
                setIsLoading(false);
            }
        };
        initializeFormData();
    }, [formData]);

    const handleUploadError = (code) => {
        const errorMessage =
            code === 1014 ? 'Đuôi file ảnh phải là jpg, png, gif, bmp !!' : 'Đăng nhạc thất bại. Hãy thử lại !!';
        setInfoNotify({ content: errorMessage, delay: 1700, isNotify: true, type: 'error' });
    };

    const handleFinish = async (values) => {
        const count = await handleCount(userAuth.id);
        const formData = new FormData();
        formData.append('songName', values.songName);
        formData.append('avatar', avatarList[0]?.originFileObj);
        formData.append('file', fileList[0]?.originFileObj);
        formData.append('lyrics', values.lyrics);
        formData.append('access', values.access);

        if (count > 1) {
            saveFormData(formData);
            setOpenFormNotifyPayment(true);
            setIsStatus(true);
            return;
        }

        try {
            setIsLoading(true);
            const data = await config.uploadMusic(formData, tokenStr);
            if (data.errorCode) {
                handleUploadError(data.errorCode.data.code);
            } else {
                setInfoNotify({
                    content: 'Đăng nhạc thành công',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
                form.resetFields();
                setAvatarList([]);
                setFileList([]);
            }
        } catch (error) {
            setInfoNotify({
                content: 'Có lỗi xảy ra. Vui lòng thử lại sau!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCount = async (userId) => {
        try {
            return await config.getCountMusic(userId, tokenStr);
        } catch (error) {
            console.error('Error fetching count:', error);
            return 0;
        }
    };

    const handleAvatarChange = ({ fileList: newFileList }) => {
        setAvatarList(newFileList.slice(-1));
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1));
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} className={cx('form')}>
            <Title level={4} className={cx('title')}>
                Đăng Nhạc
            </Title>
            <Form.Item
                name="songName"
                label="Tên bài hát"
                rules={[{ required: true, message: 'Vui lòng nhập tên bài hát!' }]}
            >
                <Input placeholder="Nhập tên bài hát" />
            </Form.Item>
            <div className={cx('upload')}>
                <Form.Item
                    name="avatar"
                    label="Upload Avatar"
                    extra="Chọn ảnh đại diện cho bài hát"
                    rules={[{ required: true, message: 'Vui lòng upload avatar!' }]}
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        fileList={avatarList}
                        onChange={handleAvatarChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        {avatarList.length < 1 && (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload Avatar</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="file"
                    label="Upload File Bài Hát"
                    extra="Chọn file bài hát"
                    rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                >
                    <Upload
                        name="file"
                        accept=".mp3,.wav"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        {fileList.length < 1 && <Button icon={<UploadOutlined />}>Upload File</Button>}
                    </Upload>
                </Form.Item>
            </div>
            <Form.Item
                name="access"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
                <Radio.Group>
                    <Radio value="public">Công khai</Radio>
                    <Radio value="private">Chỉ người theo dõi mới nghe được</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="lyrics" label="Lời bài hát" rules={[{ required: true, message: 'Vui lòng nhập lời!' }]}>
                <TextArea rows={4} placeholder="Nhập lời bài hát" />
            </Form.Item>
            <Form.Item className={cx('Btn-area')}>
                <Button type="primary" htmlType="submit" className={cx('button')} disabled={isLoading}>
                    {isLoading ? <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> : <span>Đăng</span>}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default UploadForm;
