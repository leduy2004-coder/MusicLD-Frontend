import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, CardTitle, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { UserAuth } from '../Store';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserNotify } from '../Store';
import './form.scss';
import config from '~/services';

const UpdateMusicForm = ({ musicId, musics, onMusicsUpdate, setOpenFormAddMusic }) => {
    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const [selectedFile, setSelectedFile] = useState(false);

    const [musicDetail, setMusicDetail] = useState({
        title: '',
        lyrics: '',
        avatar: null,
        status: false,
    });

    useEffect(() => {
        if (!musicId) {
            return;
        }
        const fetchData = async () => {
            try {
                const data = await config.getDetailSong(musicId, tokenStr);
                if (data.errCode) {
                    setInfoNotify({
                        content: 'Lỗi dữ liệu !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    const mappedData = {
                        title: data.title || '',
                        lyrics: data.lyrics || '',
                        avatar: data.avatarResponse || null,
                        status: data.status,
                    };
                    setSelectedFile(true);

                    setMusicDetail(mappedData);
                }
            } catch (error) {
                setInfoNotify({
                    content: 'Lỗi khi lấy dữ liệu từ server !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            }
        };
        if (tokenStr) fetchData();
    }, [musicId, tokenStr]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMusicDetail((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(false);

        const { name, files } = e.target;
        setMusicDetail((prev) => ({ ...prev, [name]: files[0] }));
    };
    const handleChangeStatus = (e) => {
        const { name, type, checked } = e.target;

        setMusicDetail((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : prevDetails[name], 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            let actionMessage = '';
            // Update the user details with the formatted date
            const formData = new FormData();
            formData.append('id', musicId);
            formData.append('title', musicDetail.title);
            formData.append('fileAvatar', musicDetail.avatar);
            formData.append('lyrics', musicDetail.lyrics);
            formData.append('publicIdAvatar', musicDetail);
            formData.append('access', musicDetail.access);

            if (musicId) {
                data = await config.updateMusic(formData, tokenStr);
             
                actionMessage = 'Cập nhật nhạc thành công !!';
            }

            if (data.errCode) {
                setInfoNotify({
                    content: 'Lỗi dữ liệu !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
                return;
            }
            // Cập nhật danh sách musics
            const updatedMusics = [data, ...(musics || [])];
            onMusicsUpdate(updatedMusics); 
            setOpenFormAddMusic(false);

            setInfoNotify({
                content: actionMessage,
                delay: 1500,
                isNotify: true,
                type: 'success',
            });
        } catch (error) {
            setInfoNotify({
                content: 'Lỗi khi lấy dữ liệu từ server !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        }
    };

    const handleClose = () => {
        setOpenFormAddMusic(false);
    };

    return (
        <div className="background-form p-5">
            <Row>
                <Col>
                    <Card className="form-card p-4">
                        <div className="form-content">
                            <div className="area-close text-end">
                                <span className="close-btn fs-3" onClick={handleClose} role="button" aria-label="Close">
                                    &times;
                                </span>
                            </div>
                            <CardTitle tag="h2" className="text-center mb-4 fs-1" style={{ color: 'red' }}>
                                Cập nhật nhạc
                            </CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="title" className="fs-3">
                                                Tên nhạc
                                            </Label>
                                            <Input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={musicDetail.title}
                                                onChange={handleChange}
                                                placeholder="Nhập tên nhạc"
                                                className="p-3 fs-3"
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="status" className="fs-3 me-3">
                                                Tình trạng
                                            </Label>
                                            <Input
                                                type="checkbox"
                                                id="status"
                                                name="status"
                                                checked={musicDetail.status}
                                                onChange={handleChangeStatus}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="avatar" className="fs-3">
                                                Ảnh đại diện
                                            </Label>
                                            <div className="file-upload mt-2">
                                                {musicDetail.avatar && selectedFile && (
                                                    <img
                                                        src={musicDetail?.avatar?.url}
                                                        alt="Avatar"
                                                        className="mb-3"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                )}
                                                <Input
                                                    type="file"
                                                    id="avatar"
                                                    name="avatar"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="form-control fs-3"
                                                />
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="lyrics" className="fs-3">
                                                Lời bài hát
                                            </Label>
                                            <ReactQuill
                                                id="lyrics"
                                                name="lyrics"
                                                value={musicDetail.lyrics}
                                                onChange={(content) =>
                                                    handleChange({ target: { name: 'lyrics', value: content } })
                                                }
                                                className="fs-3"
                                                theme="snow" // Chủ đề giao diện
                                                placeholder="Nhập lời bài hát..."
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="area-btn-submit text-center mt-4">
                                    <Button className="btn-submit btn-lg" type="submit">
                                        Cập nhật nhạc
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UpdateMusicForm;
