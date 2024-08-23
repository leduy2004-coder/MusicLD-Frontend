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

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

function ViewProfile() {
    const { id } = useParams();
    const { userAuth, tokenStr, setOpenFormLogin } = UserAuth();
    const { profileUser, setProfileUser } = UserMusic();
    // const { setInfoNotify } = UserNotify();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('nav1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        if (tokenStr) {
            const fetchProfile = async () => {
                try {
                    const data = await config.getUser(id, tokenStr);
                    setProfileUser(data.result);
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            };
            fetchProfile();
        }
    }, [id, tokenStr]);

    useEffect(() => {
        setSelectedKey('nav1');
    }, [profileUser]);

    const handleMenuClick = (e) => setSelectedKey(e.key);

    const handleFollowAction = (status) => {
        const userId = profileUser.id;
        const updateFollowStatus = async () => {
            const data = await config.updateRequestFollowUser(userId, tokenStr, status);
            setProfileUser((prev) => ({ ...prev, statusFollower: data.result}));
        };
        updateFollowStatus();
    };

    const renderContent = () => {
        switch (selectedKey) {
            case 'nav1':
                return <ItemProfile data={profileUser} />;
            case 'nav2':
                return <ItemFollow data={profileUser} />;
            case 'nav3':
                return <ItemFollow data={profileUser} />;
            default:
                return <div>Select a menu item</div>;
        }
    };

    console.log(profileUser.statusFollower)
    const menuItems = [
        { key: 'nav1', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
        { key: 'nav2', icon: <VideoCameraOutlined />, label: 'Nhạc của tôi' },
        { key: 'nav3', icon: <UsergroupAddOutlined />, label: 'Người theo dõi' },
    ];

    const menuMyItem = [...menuItems, { key: 'nav4', icon: <UploadOutlined />, label: 'Upload nhạc' }];

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
                        followStatus={profileUser.statusFollower || null}
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
