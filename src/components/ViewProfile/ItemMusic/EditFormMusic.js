import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Modal, Form, Input, Button, Upload, Select } from 'antd'; // Imported Select from antd
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import config from '~/services';
import { UserNotify } from '~/components/Store';
import styles from './ItemMusic.module.scss';
import Image from '~/components/Image';

const { TextArea } = Input;
const { Option } = Select; // Define Option for Select

const cx = classNames.bind(styles);

function EditFormMusic({ visible, onCancel, musicData, tokenStr, setMusics }) {
    const [form] = Form.useForm();
    const [avatarList, setAvatarList] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const { setInfoNotify } = UserNotify();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible && musicData) {
            form.setFieldsValue({
                title: musicData.title,
                lyrics: musicData.lyrics,
                access: musicData.access === 'PUBLIC' ? 'public' : 'private',
            });
        }
    }, [visible, musicData, form]);

    useEffect(() => {
        const avatarChanged = avatarList.length > 0;
        setHasChanges((prevHasChanges) => prevHasChanges || avatarChanged);
    }, [avatarList]);

    const handleEditSubmit = async (values) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('id', musicData.id);
            formData.append('title', values.title);
            formData.append('lyrics', values.lyrics);
            formData.append('access', values.access);

            if (avatarList.length > 0) {
                formData.append('fileAvatar', avatarList[0]?.originFileObj);
            }

            formData.append('publicIdAvatar', musicData?.avatarResponse?.publicId || '');

            const result = await config.updateMusic(formData, tokenStr);
            console.log(result);
            if (result.errCode) {
                setInfoNotify({
                    content: 'Cập nhật thất bại, hãy thử lại !!',
                    delay: 1700,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                setInfoNotify({
                    content: 'Cập nhật thành công !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
                setMusics((prevMusics) =>
                    prevMusics.map((music) =>
                        music.id === musicData.id
                            ? {
                                  ...music,
                                  ...values,
                                  avatarResponse:
                                      avatarList.length > 0 ? result.result?.avatarResponse : music.avatarResponse,
                              }
                            : music,
                    ),
                );

                onCancel();
                setIsLoading(false);
            }
        } catch (error) {
            setInfoNotify({
                content: 'Cập nhật thất bại, hãy thử lại !!',
                delay: 1700,
                isNotify: true,
                type: 'error',
            });
        }
    };

    const handleAvatarChange = ({ fileList: newFileList }) => {
        setAvatarList(newFileList.slice(-1));
    };

    const handleValuesChange = (changedValues, allValues) => {
        const songNameChanged = allValues.title !== musicData.title;
        const lyricsChanged = allValues.lyrics !== musicData.lyrics;
        const accessChanged = allValues.access !== musicData.access; // Track changes in access

        const avatarChanged = avatarList.length > 0;

        setHasChanges(songNameChanged || lyricsChanged || avatarChanged || accessChanged);
    };

    const handleRemove = (file) => {
        setAvatarList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin bài hát"
            open={visible}
            onCancel={() => {
                form.resetFields(); // Reset form only on explicit close (Cancel)
                setAvatarList([]); // Clear avatarList when modal is closed
                setHasChanges(false); // Reset change tracker
                onCancel();
            }}
            footer={null}
        >
            <Form form={form} onFinish={handleEditSubmit} layout="vertical" onValuesChange={handleValuesChange}>
                <Form.Item
                    name="title"
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
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            fileList={avatarList}
                            onRemove={handleRemove}
                            onChange={handleAvatarChange}
                            beforeUpload={() => false} // Prevent auto upload
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
                    <div className={cx('upload-container')}>
                        <Image src={musicData?.avatarResponse?.url || ''} alt="Avatar" className={cx('upload-img')} />
                    </div>
                </div>

                <Form.Item
                    name="access"
                    label="Trạng thái bài hát"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái bài hát!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="public">Công khai</Option>
                        <Option value="private">Chỉ người theo dõi</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="lyrics"
                    label="Lời bài hát"
                    rules={[{ required: true, message: 'Vui lòng nhập lời bài hát!' }]}
                >
                    <ReactQuill
                        theme="snow"
                        value={form.getFieldValue('lyrics')}
                        placeholder="Nhập lời bài hát và định dạng..."
                    />
                </Form.Item>
                <Form.Item className={cx('button-area')}>
                    <Button type="primary" htmlType="submit" disabled={!hasChanges || isLoading}>
                        {isLoading ? <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> : <span>Lưu</span>}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

EditFormMusic.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    musicData: PropTypes.object.isRequired,
    tokenStr: PropTypes.string.isRequired,
    setMusics: PropTypes.func.isRequired,
};

export default EditFormMusic;
