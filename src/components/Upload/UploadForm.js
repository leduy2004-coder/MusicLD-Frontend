import React, { useState } from 'react';
import { Form, Input, Upload, Button, Typography } from 'antd';
import classNames from 'classnames/bind';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './UploadForm.module.scss';
import { UserNotify } from '../Store';
import { UserAuth } from '../Store/AuthContext';
import config from '~/services';
const { TextArea } = Input;
const { Title } = Typography;

const cx = classNames.bind(styles);

function UploadForm() {
    const [form] = Form.useForm();
    const [avatarList, setAvatarList] = useState([]); // Trạng thái để lưu danh sách avatar tải lên
    const [fileList, setFileList] = useState([]); // Trạng thái để lưu danh sách file tải lên
    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('songName', values.songName);
        formData.append('avatar', avatarList[0]?.originFileObj); // `originFileObj` chứa đối tượng tệp
        formData.append('file', fileList[0]?.originFileObj);
        formData.append('lyrics', values.lyrics);

        try {
            setIsLoading(true);
            const data = await config.uploadMusic(formData, tokenStr);
            if (data.errorCode) {
                if (data.errorCode.data.code === 1014) {
                    setInfoNotify({
                        content: 'Đuôi file ảnh phải là jpg, png, gif, bmp !!',
                        delay: 1700,
                        isNotify: true,
                        type: 'error',
                    });
                } else
                    setInfoNotify({
                        content: 'Đăng nhạc thất bại. Hãy thử lại !!',
                        delay: 1700,
                        isNotify: true,
                        type: 'error',
                    });
            } else {
                setInfoNotify({
                    content: 'Đăng nhạc thành công',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
                // Đặt lại các trường của biểu mẫu về trạng thái rỗng
                form.resetFields();

                // Đặt lại danh sách avatar và file về mảng rỗng
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
        }
        setIsLoading(false);
    };

    const handleAvatarChange = ({ fileList: newFileList }) => {
        // Chỉ giữ lại tệp đầu tiên trong danh sách
        setAvatarList(newFileList.slice(-1));

    };

    const handleFileChange = ({ fileList: newFileList }) => {
        // Chỉ giữ lại tệp đầu tiên trong danh sách
        setFileList(newFileList.slice(-1));
    };

    return (
        <>
            <Form form={form} layout="vertical" onFinish={handleFinish} className={cx('form')}>
                <Title level={6} className={cx('title')}>
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
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        extra="Chọn ảnh đại diện cho bài hát"
                        rules={[{ required: true, message: 'Vui lòng upload avatar!' }]}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            fileList={avatarList} // Hiển thị danh sách file avatar
                            onChange={handleAvatarChange}
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1} // Giới hạn chỉ upload 1 ảnh
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
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        extra="Chọn file bài hát"
                        rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                    >
                        <Upload
                            name="file"
                            accept=".mp3,.wav"
                            fileList={fileList} // Hiển thị danh sách file tải lên
                            onChange={handleFileChange}
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1} // Giới hạn chỉ upload 1 file
                        >
                            {fileList.length < 1 && <Button icon={<UploadOutlined />}>Upload File</Button>}
                        </Upload>
                    </Form.Item>
                </div>

                <Form.Item
                    name="lyrics"
                    label="Lời bài hát"
                    rules={[{ required: true, message: 'Vui lòng nhập lời!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập lời bài hát" />
                </Form.Item>

                <Form.Item className={cx('Btn-area')}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={cx('button')}
                        disabled={isLoading} 
                    >
                        {isLoading ? <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> : <span>Đăng</span>}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default UploadForm;
