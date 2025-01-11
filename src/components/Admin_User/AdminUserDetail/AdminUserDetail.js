import React, { useEffect, useState } from 'react';
import { Typography, Avatar, Button, List, Divider, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminUserDetail.module.scss';
import config from '~/services';
import { UserAuth } from '~/components/Store';
import Image from '~/components/Image';
import classNames from 'classnames/bind';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const AdminUserDetail = () => {
    const { id } = useParams();
    const { tokenStr } = UserAuth();
    const [userDetail, setUserDetail] = useState(null);
    const [userMusic, setUserMusic] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (tokenStr) {
            const fetchUserDetails = async () => {
                try {
                    const [profileData, musicData] = await Promise.all([
                        config.getUser(id, tokenStr),
                        config.getPlaylist(id, tokenStr),
                    ]);
                    setUserDetail(profileData);
                    setUserMusic(musicData || []);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            fetchUserDetails();
        }
    }, [id, tokenStr]);

    const onBack = () => {
        navigate('/admin/user');
    };

    return (
        <div className={cx('admin-user-detail')}>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} className={cx('back-button')} type="primary">
                Quay lại
            </Button>
            {userDetail && (
                <>
                    <div className={cx('user-header')}>
                        <Image src={userDetail.avatar?.url} alt="Avatar" className={cx('avatar')} />
                        <Title level={3} className={cx('user-name')}>
                            {userDetail.nickName || 'Không xác định'}
                        </Title>
                        <Text type={userDetail.status ? 'success' : 'danger'}>
                            {userDetail.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </Text>
                    </div>
                    <Divider />
                    <div className={cx('user-info')}>
                        <Text>Ngày sinh: {userDetail.dateOfBirth || 'Không xác định'}</Text>
                        <br />
                        <Text>
                            Giới tính:{' '}
                            {userDetail.gender === true ? 'Nam' : userDetail.gender === false ? 'Nữ' : 'Không xác định'}
                        </Text>

                        <br />

                        <Text>Số lượng người theo dõi: {userDetail.countFollower}</Text>
                        <br />
                    </div>
                    <Divider />
                    <div className={cx('user-music')}>
                        <Title level={4} className={cx('music-title')}>
                            Danh sách nhạc đã đăng
                        </Title>
                        <List
                            className={cx('music-list')}
                            dataSource={userMusic}
                            renderItem={(item) => (
                                <List.Item key={item.id} className={cx('music-item')}>
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                                src={item?.avatarResponse?.url}
                                                alt="Music Thumbnail"
                                                className={cx('music-thumbnail')}
                                            />
                                        }
                                        title={
                                            <span className={cx('music-title-text')}>
                                                {item.title || 'Không rõ tên bài hát'}
                                            </span>
                                        }
                                        description={
                                            <div className={cx('music-info')}>
                                                <span className={cx('likes')}>
                                                    Lượt thích: <strong>{item.countLike || 0}</strong>
                                                </span>
                                                <span className={cx('status')}>
                                                    Trạng thái:
                                                    <Tag color={item.status === true ? 'green' : 'red'}>
                                                        {item.status === true ? 'Đã duyệt' : 'Chưa duyệt'}
                                                    </Tag>
                                                </span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserDetail;
