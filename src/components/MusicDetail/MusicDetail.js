import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlay,
    faPause,
    faHeart as faHeartSolid,
    faMusic,
    faMinus,
    faPlus,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComments } from '@fortawesome/free-regular-svg-icons';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import ItemMusic from '../ViewProfile/ItemMusic/ItemMusic';
import { UserAuth } from '../Store';
import icons from '~/utils/icon';
import config from '~/services';
import styles from './MusicDetail.module.scss';
import Image from '../Image';
import Button from '../Button';
import Comments from './Comment/Comments';
import { UserMusic, UserNotify } from '~/components/Store';
import AudioLoading from '../AudioLoading/AudioLoading';
const cx = classNames.bind(styles);
const { BsPlayCircle } = icons;

function MusicDetail({ data = {} }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const { userAuth, tokenStr, avatar } = UserAuth();
    const [activeKey, setActiveKey] = useState(localStorage.getItem('selectedMusicKey') || 'nav1');
    const [publicMusic, setPublicMusic] = useState([]);
    const [currentMusic, setCurrentMusic] = useState();
    const [status, setStatus] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát nhạc
    const [countLike, setCountLike] = useState(0);
    const [isAdding, setIsAdding] = useState(false); // Trạng thái đang thêm nhạc
    const { setInfoNotify } = UserNotify();

    const {
        addSong,
        removeSong,
        songs,
        setCurrentSongId,
        currentSongId,
        setAutoPlay,
        audio,
        setIsPlay,
        isPlay,
        setPriorityMusic,
        isLiked,
        setIsLiked,
    } = UserMusic();

    useEffect(() => {
        console.log(!status);
        if (currentSongId === currentMusic?.id && !status) {
            setIsPlaying(!isPlaying);
        }
        setStatus(false);
    }, [isPlay]);

    const handleTogglePlay = () => {
        if (currentMusic) {
            const songExists = songs.some((song) => song.id === currentMusic.id);
            if (!songExists && !isPlaying) {
                console.log('a');
                setPriorityMusic(true);
                addSong(currentMusic);
                setStatus(true);
                setIsPlaying(true);
                return;
            }
        }

        if (!isPlaying && currentSongId !== currentMusic.id) {
            console.log('b');
            setCurrentSongId(currentMusic.id);
            setAutoPlay(true);
            setIsPlay(true);
            setStatus(false);
        } else if (!isPlaying && currentSongId === currentMusic.id) {
            console.log('c');
            audio.play();
            setStatus(true);
            setIsPlay(true);
        } else {
            console.log('d');
            audio.pause();
            setStatus(true);
            setIsPlay(false);
        }

        setIsPlaying(!isPlaying);
    };

    const handleToggleLike = async () => {
        if (isLiked) {
            const data = await config.unLikeMusic(userAuth.id, currentMusic.id, tokenStr);
            console.log(data);
            if (data) {
                setCountLike(countLike - 1);
                setInfoNotify({
                    content: 'Đã hủy thích nhạc !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
            }
        } else {
            const musicData = await config.likeMusic(userAuth.id, currentMusic.id, tokenStr);
            if (musicData) {
                setCountLike(countLike + 1);
                setInfoNotify({
                    content: 'Đã thích nhạc !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
            }
        }
        setIsLiked(!isLiked); // Đảo ngược trạng thái "liked"
    };

    const handleAddMusic = () => {
        const songIndex = songs.findIndex((song) => song.id === currentMusic.id);
        if (isAdding && songIndex !== -1) {
            removeSong(songIndex);
        } else {
            addSong(currentMusic);
        }
        setIsAdding(!isAdding);
    };
    useEffect(() => {
        localStorage.setItem('selectedMusicKey', 'nav1');
        setIsLiked(currentMusic?.like);
        setCountLike(currentMusic?.countLike);
    }, [currentMusic]);
    const handleTabChange = (key) => {
        setActiveKey(key);
        localStorage.setItem('selectedMusicKey', key);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userAuth || !tokenStr) return;
                if (id !== '0' && id) {
                    const musicData = await config.getDetailSong(id, tokenStr);
                    console.log(musicData);
                    setCurrentMusic(musicData);

                    const listMusic = await config.getPlaylistByAccess(musicData.idUser, tokenStr, 'PUBLIC');
                    setPublicMusic(listMusic.result);
                } else {
                    const listMusic = await config.getPlaylist(userAuth.id, tokenStr);
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

    useEffect(() => {
        if (currentMusic) {
            const songExists = songs.some((song) => song.id === currentMusic.id);

            if (!songExists) {
                console.log('1');
                setIsPlaying(false);
                setIsAdding(songExists);
            } else if (isPlay && currentMusic.id === currentSongId) {
                console.log('2');
                setIsPlay(true);
                setIsPlaying(true);
                setIsAdding(songExists);
            } else if (isPlay && currentMusic.id !== currentSongId) {
                console.log('3');

                setIsPlaying(false);
                setIsAdding(songExists);
            }
            setIsAdding(songExists);
        }
    }, [currentMusic, songs, currentSongId]);

    const handleUser = () => {
        navigate(`/profile/${currentMusic?.idUser}`);
    };

    const tabsItems = [
        {
            key: 'nav1',
            label: (
                <span
                    className={cx({
                        'menu-item-selected': activeKey === '1',
                        'menu-item-detail': activeKey !== 'nav1',
                    })}
                >
                    <FontAwesomeIcon icon={faMusic} /> Lời nhạc
                </span>
            ),
            children: <div className={cx('lyric')} dangerouslySetInnerHTML={{ __html: currentMusic?.lyrics }} />,
        },
        {
            key: 'nav2',
            label: (
                <span
                    className={cx({
                        'menu-item-selected': activeKey === '2',
                        'menu-item-detail': activeKey !== 'nav2',
                    })}
                >
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

    return (publicMusic?.length > 0 && id === '0') || id !== '0' ? (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('relative')}>
                    <Image
                        className={cx('avatar-music', isPlaying ? 'rotate-center' : 'rotate-center-pause')}
                        src={currentMusic?.avatarResponse.url}
                    />
                    <div className={cx('icon-state')}>
                        {isPlaying ? <AudioLoading /> : <BsPlayCircle className={cx('pause-icon')} />}
                    </div>
                    <div className={cx('modal-avatar', isPlaying ? 'rotate-center' : 'rotate-center-pause')}></div>
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('info-name')}>{currentMusic?.title}</h2>
                    <span style={{ opacity: '0.5' }}>Sáng tác: {currentMusic?.nickName}</span>
                    <span style={{ opacity: '0.5' }}>{countLike} người yêu thích</span>
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
                            {currentMusic?.idUser !== userAuth.id && (
                                <FontAwesomeIcon
                                    title={isLiked ? 'Bỏ thích' : 'Thích'}
                                    className={cx('icon')}
                                    icon={isLiked ? faHeartSolid : faHeartRegular}
                                    onClick={handleToggleLike}
                                />
                            )}
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
                        defaultActiveKey="nav1"
                        activeKey={activeKey}
                        onChange={handleTabChange}
                        items={tabsItems}
                        className={styles.customTabs}
                    />
                </div>
                <div className={cx('account')}>
                    <div className={cx('position')}>
                        <div className={cx('account-user')}>
                            <Image className={cx('account-img')} src={currentMusic?.userAvatarResponse?.url} />
                            <div className={cx('account-name')}>{currentMusic?.nickName}</div>
                            <div className={cx('account-profile')}>
                                <FontAwesomeIcon
                                    title={'Trang cá nhân'}
                                    className={cx('icon-profile')}
                                    icon={faUser}
                                    onClick={handleUser}
                                />
                            </div>
                        </div>
                        <ItemMusic data={publicMusic} detailMusic={true} />
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
