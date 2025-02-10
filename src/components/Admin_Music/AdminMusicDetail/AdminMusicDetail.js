import React, { useEffect, useState } from 'react';
import { Typography, Avatar, Button, List, Divider, Tag, Skeleton, Space, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import config from '~/services';
import { UserAuth } from '~/components/Store';
import styles from './AdminMusicDetail.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Title, Text, Paragraph } = Typography;
const cx = classNames.bind(styles);

const AdminMusicDetail = () => {
    const { id } = useParams();
    const { tokenStr } = UserAuth();
    const [musicDetail, setMusicDetail] = useState(null);
    const [userLike, setUserLike] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const quillRef = React.useRef(null);

    useEffect(() => {
        if (tokenStr) {
            const fetchMusicDetails = async () => {
                try {
                    const [detailMusic, userLike] = await Promise.all([
                        config.getDetailSong(id, tokenStr),
                        config.getAllUserLike(id, tokenStr),
                    ]);
                    const data = await config.getUser(detailMusic.idUser, tokenStr);
                    setUser(data);
                    setMusicDetail(detailMusic);
                    setUserLike(userLike || []);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMusicDetails();
        }
    }, [id, tokenStr]);

    const onBack = () => {
        navigate('/admin/music');
    };
    const handleUserClick = (userId) => {
        window.open(`/admin/user/detail/${userId}`, '_blank');
    };

    return (
        <div className={cx('admin-music-detail')}>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 20 }} type="primary">
                Quay lại
            </Button>

            {loading ? (
                <Skeleton active />
            ) : (
                <div>
                    {/* Music Details */}
                    <div
                        className={cx('header-section')}
                        style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}
                    >
                        <Image
                            src={musicDetail?.avatarResponse?.url}
                            alt="Song Thumbnail"
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                            }}
                        />
                        <Space direction="vertical" style={{ flex: 1 }}>
                            <Title level={3}>{musicDetail?.title || 'Không rõ'}</Title>
                            <Text>Thời lượng: {musicDetail?.duration || 'Không rõ'}</Text>
                            <Tag color={musicDetail?.status ? 'green' : 'red'}>
                                {musicDetail?.status ? 'Hoạt động' : 'Ngừng hoạt động'}
                            </Tag>
                            <Text>
                                <Tag>{musicDetail?.access || 'Không xác định'}</Tag>
                            </Text>
                        </Space>
                    </div>

                    <Divider />

                    {/* Lyrics */}
                    <div className={cx('lyrics-section')}>
                        <Row gutter={16}>
                            {/* Cột Lyrics */}
                            <Col xs={24} md={12}>
                                <div className={cx('lyrics-container')}>
                                    <Title level={4}>Lời bài hát</Title>
                                    <ReactQuill
                                        ref={quillRef}
                                        value={musicDetail?.lyrics || 'Không có lời bài hát.'}
                                        readOnly
                                        theme="bubble"
                                        className={cx('lyrics-editor')}
                                    />
                                </div>
                            </Col>

                            {/* Cột Thông Tin Tác Giả */}
                            <Col xs={24} md={12}>
                                <div className={cx('author-info-container')} onClick={() => handleUserClick(user?.id)}>
                                    <Title level={4}>Thông tin tác giả</Title>
                                    <div className={cx('author-info')}>
                                        <Image
                                            src={user?.avatar?.url}
                                            size={64}
                                            className={cx('author-avatar')}
                                            alt="Tác giả"
                                        />
                                        <div className={cx('author-details')}>
                                            <Text strong>{user?.nickName || 'Không rõ'}</Text>
                                            <p>Ngày sinh: {user?.dateOfBirth || 'Không rõ'}</p>
                                            <p>
                                                Trạng thái:{' '}
                                                {user?.status ? (
                                                    <Tag color="green">Hoạt động</Tag>
                                                ) : (
                                                    <Tag color="red">Ngừng hoạt động</Tag>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Divider />

                    {/* User List */}
                    <div className={cx('user-list-section')}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                            }}
                        >
                            <Title level={4} style={{ margin: 0 }}>
                                Danh sách người dùng thích
                            </Title>
                            <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
                                Tổng số: {userLike?.length || 0}
                            </Tag>
                        </div>
                        <List
                            itemLayout="horizontal"
                            dataSource={userLike}
                            renderItem={(user) => (
                                <List.Item onClick={() => handleUserClick(user.id)}>
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                                src={user?.avatar?.url}
                                                alt="Music Thumbnail"
                                                className={cx('avatar')}
                                            />
                                        }
                                        title={<Text strong>{user.nickName}</Text>}
                                        description={`Ngày sinh: ${user.dateOfBirth}`}
                                    />
                                </List.Item>
                            )}
                            locale={{
                                emptyText: 'Không có người dùng nào.',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMusicDetail;
