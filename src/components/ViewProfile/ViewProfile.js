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
    UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Image from '~/components/Image';
import { UserAuth, UserMusic } from '~/components/Store';
import ItemProfile from './ItemProfile/ItemProfile';
import config from '~/services';

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);

function ViewProfile() {
    const { id } = useParams();
    const { userAuth, tokenStr, avatar } = UserAuth();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('nav1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'nav1',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
            className: selectedKey === 'nav1' ? cx('menu-item-selected') : '',
        },
        {
            key: 'nav2',
            icon: <VideoCameraOutlined />,
            label: 'Nhạc của tôi',
            className: selectedKey === 'nav2' ? cx('menu-item-selected') : '',
        },
        {
            key: 'nav3',
            icon: <UsergroupAddOutlined />,
            label: 'Người theo dõi',
            className: selectedKey === 'nav3' ? cx('menu-item-selected') : '',
        },
        {
            key: 'nav4',
            icon: <UploadOutlined />,
            label: 'Upload nhạc',
            className: selectedKey === 'nav4' ? cx('menu-item-selected') : '',
        },
    ];

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case 'nav1':
                return (
                    <div>
                        <ItemProfile />
                    </div>
                );
            case 'nav2':
                return <div>Content for Nav 2</div>;
            case 'nav3':
                return <div>Content for Nav 3</div>;
            default:
                return <div>Select a menu item</div>;
        }
    };
    // const [videosProfile, setVideosProfile] = useState([]);

    // const { profileUser, setProfileUser, listVideos, setListVideos } = UserMusic();

    // useEffect(() => {
    //     setVideosProfile(listVideos);
    // }, [listVideos]);

    // useEffect(() => {
    //     setProfileUser({});
    //     setListVideos([]);

    //     const fetchApi = async () => {
    //         const data = await config.getUser(id, tokenStr);

    //         setProfileUser(data);
    //         setListVideos(data.videos);
    //     };

    //     fetchApi();
    // }, [id]);

    // if (Object.keys(profileUser).length === 0 || videosProfile.length === 0) {
    //     return;
    // }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} className={cx('nav-aside')}>
                <div className={cx('logo', { collapsed, expanded: !collapsed })}>
                    <Image className={cx('user-avatar')} src={avatar} alt={userAuth.nickName} />
                </div>
                <Menu
                    className={cx('menu')}
                    theme="dark" // Sử dụng state theme để cập nhật theme của Menu
                    mode="inline"
                    defaultSelectedKeys={['nav1']}
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 44,
                        }}
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
