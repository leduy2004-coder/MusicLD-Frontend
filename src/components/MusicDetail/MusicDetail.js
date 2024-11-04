import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faHeart as faHeartSolid, faMusic, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComments } from '@fortawesome/free-regular-svg-icons';
import { useParams } from 'react-router-dom';

import ItemMusic from '../ViewProfile/ItemMusic/ItemMusic';
import { UserAuth } from '../Store';
import config from '~/services';
import styles from './MusicDetail.module.scss';
import Image from '../Image';
import Button from '../Button';
import Comments from './Comment/Comments';
import { UserMusic, UserNotify } from '~/components/Store'

const cx = classNames.bind(styles);

function MusicDetail({ data = {} }) {
    const { id } = useParams();
    
    const { userAuth, tokenStr } = UserAuth();
    const [activeKey, setActiveKey] = useState('1');
    const [publicMusic, setPublicMusic] = useState([]);
    const [currentMusic, setCurrentMusic] = useState();

    const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát nhạc
    const [isLiked, setIsLiked] = useState(false); // Trạng thái thích
    const [isAdding, setIsAdding] = useState(false); // Trạng thái đang thêm nhạc

    const { addSong, removeSong, songs, currentSongId } = UserMusic();

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying); // Đổi trạng thái phát nhạc
    };

    const handleToggleLike = () => {
        setIsLiked(!isLiked); // Đổi trạng thái thích
    };

    const handleAddMusic = () => {
        if (isAdding) {
            removeSong(currentMusic.id); 
        } else {
            addSong(currentMusic); 
        }
        setIsAdding(!isAdding); 
    };
    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userAuth || !tokenStr) return; 
                console.log(id)
                if (id !== '0' && id) {
                    
                    const musicData = await config.getDetailSong(id, tokenStr);   
                    console.log(musicData)     
                    setCurrentMusic(musicData);

                    const listMusic = await config.getPlaylistByAccess(musicData.idUser, tokenStr, 'PUBLIC');
                    setPublicMusic(listMusic.result);
                } else {
                    console.log(userAuth.id);
                    const listMusic = await config.getPlaylistByAccess(userAuth.id, tokenStr, 'PUBLIC');
                    setPublicMusic(listMusic.result);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, userAuth, tokenStr]);

    useEffect(() => {
        if (id === '0' && publicMusic?.length > 0) {

            setCurrentMusic(publicMusic[0]);
        }
    }, [publicMusic]);
    const tabsItems = [
        {
            key: '1',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '1', 'menu-item': activeKey !== '1' })}>
                    <FontAwesomeIcon icon={faMusic} /> Lời nhạc
                </span>
            ),
            children: <div className={cx('lyric')}>{currentMusic?.lyrics}</div>,
        },
        {
            key: '2',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '2', 'menu-item': activeKey !== '2' })}>
                    <FontAwesomeIcon icon={faComments} /> Bình luận
                </span>
            ),
            children: (
                <div>
                    <Comments currentMusicId={currentMusic?.id} />
                </div>
            ),
        },
    ];

    return (publicMusic?.length > 0 &&  id === '0') || id !== '0'? (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div>
                    <Image className={cx('avatar-music')} src={currentMusic?.avatarResponse.url} />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('info-name')}>{currentMusic?.title}</h2>
                    <span style={{ opacity: '0.5' }}>Sáng tác: {currentMusic?.nickName}</span>
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
                            <Image className={cx('account-img')} src={currentMusic?.avatarResponse.url} />
                            <div className={cx('account-name')}>{currentMusic?.nickName}</div>
                        </div>
                        <ItemMusic data={publicMusic} detailMusic={true}/>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Empty
            imageStyle={{
                height: 220,
            }}
            description={<Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa đăng nhạc</Typography.Text>}
        />
    );
}

export default MusicDetail;
