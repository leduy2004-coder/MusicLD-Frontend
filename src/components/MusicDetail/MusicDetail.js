import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faHeart as faHeartSolid, faMusic, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComments } from '@fortawesome/free-regular-svg-icons';

import ItemMusic from '../ViewProfile/ItemMusic/ItemMusic';
import { UserAuth } from '../Store';
import config from '~/services';
import styles from './MusicDetail.module.scss';
import Image from '../Image';
import Button from '../Button';

const cx = classNames.bind(styles);

function MusicDetail({ data = {} }) {
    const { userAuth, tokenStr } = UserAuth();
    const [activeKey, setActiveKey] = useState('1');
    const [publicMusic, setPublicMusic] = useState([]);

    const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát nhạc
    const [isLiked, setIsLiked] = useState(false); // Trạng thái thích
    const [isAdding, setIsAdding] = useState(false); // Trạng thái đang thêm nhạc

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying); // Đổi trạng thái phát nhạc
    };

    const handleToggleLike = () => {
        setIsLiked(!isLiked); // Đổi trạng thái thích
    };

    const handleAddMusic = () => {
        setIsAdding(!isAdding); // Đổi trạng thái thêm nhạc
    };
    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (data?.id) {
                    const publicMusicData = await config.getPlaylistByAccess(data.id, tokenStr, 'PUBLIC');

                    setPublicMusic(publicMusicData.result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data, tokenStr]);
    const tabsItems = [
        {
            key: '1',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '1', 'menu-item': activeKey !== '1' })}>
                    <FontAwesomeIcon icon={faMusic} /> Lời nhạc
                </span>
            ),
            children: <div className={cx('lyric')}>loiaf ad adjk ka oa oa aoa dsafad</div>,
        },
        {
            key: '2',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '2', 'menu-item': activeKey !== '2' })}>
                    <FontAwesomeIcon icon={faComments} /> Bình luận
                </span>
            ),
            children: data.id ? (
                <div></div>
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
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div>
                    <Image className={cx('avatar-music')} />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('info-name')}>Bao lời con chưa nói</h2>
                    <span style={{ opacity: '0.5' }}>Sáng tác: Lê Duy</span>
                    <span style={{ opacity: '0.5' }}>10 người yêu thích</span>
                    <div className={cx('area-button')}>
                        <Button
                            primary
                            leftIcon={
                                <FontAwesomeIcon className={cx('icon-music')} icon={isPlaying ? faPause : faPlay} />
                            }
                            onClick={handleTogglePlay}
                        >
                            {isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                        </Button>
                        <div className={cx('area-icon')}>
                            <FontAwesomeIcon
                                title={isLiked ? 'Bỏ thích' : 'Thích'}
                                className={cx('icon')}
                                icon={isLiked ? faHeartSolid : faHeartRegular}
                                onClick={handleToggleLike}
                            />
                            <FontAwesomeIcon
                                title={isAdding ? 'Bỏ nhạc' : 'Thêm nhạc'}
                                className={cx('icon')}
                                icon={isAdding ? faMinus : faPlus}
                                onClick={handleAddMusic}
                                style={{ cursor: 'pointer', marginLeft: '8px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('tab')}>
                    <Tabs
                        defaultActiveKey="1"
                        activeKey={activeKey}
                        onChange={handleTabChange}
                        items={tabsItems}
                        className={styles.customTabs}
                    />
                </div>
                <div className={cx('account')}>
                    <div className={cx('position')}>
                        <div className={cx('account-user')}>
                            <Image className={cx('account-img')} />
                            <div className={cx('account-name')}>Lê Duy</div>
                        </div>
                        <ItemMusic data={publicMusic} playMusic={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicDetail;
