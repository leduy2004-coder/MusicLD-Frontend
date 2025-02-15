import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ViewProfile.module.scss';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Image from '~/components/Image';
import { UserAuth, UserMusic } from '~/components/Store';
import ItemProfile from './ItemProfile/ItemProfile';
import ItemFollow from './ItemFollow/ItemFollow';
import config from '~/services';
import ButtonFollow from '../Button/ButtonFollow';
import ItemMusic from './ItemMusic/ItemMusic';
import MenuMusic from './ItemMusic/MenuMusic';

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

function ViewProfile() {
    const { id } = useParams();
    const { userAuth, tokenStr, setOpenFormLogin } = UserAuth();
    const { profileUser, setProfileUser } = UserMusic();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || 'nav1'); // Lấy giá trị từ localStorage nếu có
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    
    useEffect(() => {
        if (tokenStr) {
            const fetchProfile = async () => {
                try {
                    const data = await config.getUser(id, tokenStr);
                    setProfileUser(data);
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            };
            fetchProfile();
        }
    }, [id, tokenStr]);
    useEffect(() => {
        const storedSelectedKey = localStorage.getItem('selectedKey') || 'nav1';
        setSelectedKey(storedSelectedKey);
    }, [id]);
    const handleMenuClick = (e) => {
        setSelectedKey(e.key); // Cập nhật `selectedKey`
        localStorage.setItem('selectedKey', e.key); // Lưu vào localStorage
    };

    const handleFollowAction = (status) => {
        const userId = profileUser.id;
        const updateFollowStatus = async () => {
            const data = await config.updateRequestFollowUser(userId, tokenStr, status);
            setProfileUser((prev) => ({ ...prev, statusFollower: data.result }));
        };
        updateFollowStatus();
    };

    const renderContent = () => {
        switch (selectedKey) {
            case 'nav1':
                return <ItemProfile data={profileUser} />;
            case 'nav2':
                return <MenuMusic data={profileUser} />;
            case 'nav3':
                return <ItemFollow data={profileUser} />;
            case 'nav4':
                return <ItemMusic data={profileUser} />;
            default:
                return <div>Select a menu item</div>;
        }
    };

    const menuItems = [
        { key: 'nav1', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
        { key: 'nav2', icon: <VideoCameraOutlined />, label: 'Nhạc của tôi' },
        { key: 'nav3', icon: <UsergroupAddOutlined />, label: 'Người theo dõi' },
    ];

    const menuMyItem = [...menuItems, { key: 'nav4', icon: <UploadOutlined />, label: 'Quản lí nhạc' }];

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} className={cx('nav-aside')}>
                <div className={cx('logo', { collapsed, expanded: !collapsed })}>
                    <Image className={cx('user-avatar')} src={profileUser?.avatar?.url} alt={userAuth.nickName} />
                </div>
                <Menu
                    className={cx('menu')}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['nav1']}
                    selectedKeys={[selectedKey]}
                    items={profileUser.id === userAuth.id ? menuMyItem : menuItems}
                    onClick={handleMenuClick}
                />
                <div className={cx('follow', { collapsed, expanded: !collapsed })}>
                    <ButtonFollow
                        followStatus={(() => {
                            if (profileUser.statusFollower === 'ACCEPTED') {
                                return 'FRIEND';
                            } else if (!profileUser.statusFollower) {
                                return 'CANCELED';
                            } else {
                                return profileUser.statusFollower;
                            }
                        })()}
                        profileUser={profileUser}
                        handleFollowAction={handleFollowAction}
                    />
                </div>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 44 }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '10px 16px',
                        minHeight: '70vh',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}

export default ViewProfile;
