import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faPersonMilitaryToPerson } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ItemMusic.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import ItemMusic from './ItemMusic';

const cx = classNames.bind(styles);

function MenuMusic({ data = {} }) {
    const { userAuth, tokenStr } = UserAuth();

    const [privateMusic, setPrivateMusic] = useState([]);
    const [publicMusic, setPublicMusic] = useState([]);

    const [activeKey, setActiveKey] = useState('1');
    const [isFollowing, setIsFollowing] = useState(false);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const privateMusicData = await config.getPlaylistByAccess(data.id, tokenStr, 'PRIVATE');
                const publicMusicData = await config.getPlaylistByAccess(data.id, tokenStr, 'PUBLIC');

                setPrivateMusic(privateMusicData.result);
                setPublicMusic(publicMusicData.result);

                const followStatus = await config.checkFollow(data.id, tokenStr);
                setIsFollowing(followStatus.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data, tokenStr]);

    const renderTabContent = (musicList) => {
        if (!Array.isArray(musicList) || musicList.length === 0) {
            return (
                <Empty
                    imageStyle={{ height: 220 }}
                    description={
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa đăng nhạc</Typography.Text>
                    }
                />
            );
        }

        return <ItemMusic data={musicList} playMusic={true} />;
    };

    const tabsItems = [
        {
            key: '1',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '1', 'menu-item': activeKey !== '1' })}>
                    <FontAwesomeIcon icon={faUserFriends} /> Công khai
                </span>
            ),
            children: renderTabContent(publicMusic),
        },
        {
            key: '2',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '2', 'menu-item': activeKey !== '2' })}>
                    <FontAwesomeIcon icon={faPersonMilitaryToPerson} /> Riêng tư
                </span>
            ),
            children: isFollowing || userAuth.id === data.id? (
                renderTabContent(privateMusic)
            ) : (
                <Empty
                    imageStyle={{ height: 220 }}
                    description={
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>
                            Vui lòng follow để truy cập
                        </Typography.Text>
                    }
                />
            ),
        },
    ];

    return (
        <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={handleTabChange}
            items={tabsItems}
            className={styles.customTabs}
        />
    );
}

ItemMusic.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired, 
    playMusic: PropTypes.bool,
};
export default MenuMusic;
