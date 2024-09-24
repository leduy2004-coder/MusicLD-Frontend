import React, { useEffect, useState, useRef } from 'react';
import config from '~/services';
import moment from 'moment';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import icons from '~/utils/icon';
import { Slider } from 'antd';
import styles from './PlayMusic.module.scss';
import Image from '../Image';
import { UserMusic } from '../Store';
import Menu from '../Popper/Menu';

const cx = classNames.bind(styles);
const {
    AiOutlineHeart,
    BiDotsHorizontalRounded,
    BiSkipNext,
    BiSkipPrevious,
    BsPlayCircle,
    CiRepeat,
    PiShuffleLight,
    FiPauseCircle,
    BiWindows,
    BsFillVolumeUpFill,
    BsRepeat1,
    BiSolidPlaylist,
    FaInfoCircle,
} = icons;

let intervalID;

const PlayMusic = () => {
    const {
        songs,
        currentSongId,
        setCurrentSongId,
        autoPlay,
        isPlay,
        setIsPlay,
        songInfo,
        setSongInfo,
        crSecond,
        setCrSecond,
        audio,
        setAudio,
        volumes,
        setVolumes,
        isShuff,
        setIsShuff,
        repeatMode,
        setRepeatMode,
        runTimeref,
        trackref,
        setIsShow,
    } = UserMusic();

    const onChangeValue = (value) => {
        setVolumes(value / 100);
        if (audio) audio.volume = value / 100;
    };

    useEffect(() => {
        const fetchDetailSong = async () => {
            if (currentSongId) {
                const res = await config.getDetailSong(currentSongId);
                if (res.errCode) {
                    setAudio(null);
                    setIsPlay(false);
                    setCrSecond(0);
                    runTimeref.current.style.cssText = `right: ${100}%`;
                } else {
                    setSongInfo(res);

                    const newAudio = new Audio(res.url);
                    newAudio.volume = volumes;
                    setAudio(newAudio);

                    if (autoPlay) {
                        setIsPlay(true);
                        audio.pause();
                    }
                }
            } else {
                setSongInfo(null);
                if (audio) {
                    console.log('2')
                    audio.pause();
                    setAudio(null);
                    setIsPlay(false);
                    setCrSecond(0);
                    runTimeref.current.style.cssText = `right: ${100}%`;
                }
            }
        };
        fetchDetailSong();
    }, [currentSongId]);

    useEffect(() => {
        if (audio && isPlay && runTimeref.current) {
            audio.play();
            intervalID = setInterval(() => {
                let percent = Math.round((audio.currentTime * 10000) / songInfo?.duration) / 100;
                runTimeref.current.style.cssText = `right: ${100 - percent}%`;
                setCrSecond(Math.round(audio.currentTime));
            }, 1000);

            return () => {
                clearInterval(intervalID);
            };
        }
    }, [audio, isPlay]);

    useEffect(() => {
        const handleEnded = () => {
            if (isShuff) {
                handleShuff();
            } else if (repeatMode) {
                repeatMode === 1 ? handleRepeatOne() : handleNextSong();
            } else if (isShuff && repeatMode) {
                handleShuff();
            } else {
                handleNextSong();
            }
        };

        if (audio) {
            audio.addEventListener('ended', handleEnded);
        }
        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleEnded);
            }
        };
    }, [audio, isShuff, repeatMode]);

    const handlePlayMusic = () => {
        if (songs.length > 0) {
            if (isPlay) {
                audio.pause();
                setIsPlay(false);
            } else {
                audio.play();
                setIsPlay(true);
            }
        }
    };

    const handleClickProgesBar = (e) => {
        if (songs.length > 0) {
            const tracRect = trackref.current.getBoundingClientRect();
            const percent = Math.round(((e.clientX - tracRect.left) * 10000) / tracRect.width) / 100;
            runTimeref.current.style.cssText = `right: ${100 - percent}%`;
            audio.currentTime = (percent * songInfo.duration) / 100;
            setCrSecond(Math.round((percent * songInfo.duration) / 100));
        }
    };

    const handleNextSong = () => {
        if (songs.length > 1) {
            let currentSongIndex;
            songs.forEach((item, index) => {
                if (item.id === currentSongId) currentSongIndex = index;
            });

            if (isShuff) {
                handleShuff();
            } else if (repeatMode === 2 && currentSongIndex === songs.length - 1) {
                setCurrentSongId(songs[0].id);
            } else {
                if (currentSongIndex === songs.length - 1) {
                    return;
                } else {
                    setCurrentSongId(songs[currentSongIndex + 1].id);
                }
            }

            audio.pause(); // Tạm dừng bài nhạc hiện tại trước khi chuyển

            if (!isPlay) {
                setTimeout(() => {
                    setIsPlay(true);
                }, 300);
            }
        }
    };

    const handlePrevSong = () => {
        if (songs.length > 1) {
            let currentSongIndex;
            songs.forEach((item, index) => {
                if (item.id === currentSongId) currentSongIndex = index;
            });
            if (currentSongIndex === 0) {
                return;
            } else {
                setCurrentSongId(songs[currentSongIndex - 1].id);
            }
            audio.pause();
            if (!isPlay) {
                setTimeout(() => {
                    setIsPlay(true);
                }, 300);
            }
        }
    };

    const handleShuff = () => {
        if (songs.length > 1) {
            const randomIndex = Math.floor(Math.random() * songs?.length);
            console.log(randomIndex);
            if (randomIndex === currentSongId - 1) handleRepeatOne();
            else {
                setCurrentSongId(songs[randomIndex].id);
                setIsPlay(true);
                audio.pause();
            }
        }
    };

    const handleRepeatOne = () => {
        audio.play();
    };
    useEffect(() => {
        if (songs.length > 0) {
            setCurrentSongId(songs[0].id);
        }
    }, [songs]);

    const navigate = useNavigate();
    const handleOpenInfo = () => {
        if (songInfo && songInfo.idUser) {
            navigate(`/profile/${songInfo.idUser}`);
            localStorage.setItem('selectedKey', 'nav2');
        }
    };
    return (
        <div className={cx('play-music')}>
            <div className={cx('play_control')}>
                <div className={cx('detail_song')}>
                    <div className={cx('ava_thumb')}>
                        <Image src={songInfo?.avatarResponse?.url} />
                    </div>
                    <div className={cx('song_infor')}>
                        <p>{songInfo?.title}</p>
                        <span>{songInfo?.nickName}</span>
                    </div>
                    <div className={cx('like_action')}>
                        <span>
                            <AiOutlineHeart size={21} />
                        </span>

                        <span onClick={handleOpenInfo}>
                            <FaInfoCircle size={21} />
                        </span>
                    </div>
                </div>
                <div className={cx('main_control')}>
                    <div className={cx('control')}>
                        <span
                            title="Bật phát ngẫu nhiên"
                            onClick={() => setIsShuff((prev) => !prev)}
                            className={cx(!isShuff ? 'isFalse' : 'isTrue')}
                        >
                            <PiShuffleLight size={21} />
                        </span>
                        <span>
                            <BiSkipPrevious
                                size={27}
                                onClick={handlePrevSong}
                                className={cx(!songs ? 'bur_next' : 'btn_next')}
                            />
                        </span>
                        <span onClick={handlePlayMusic}>
                            {isPlay ? <FiPauseCircle size={40} /> : <BsPlayCircle size={40} />}
                        </span>
                        <span onClick={handleNextSong} className={cx(!songs ? 'bur_next' : 'btn_next')}>
                            <BiSkipNext size={27} />
                        </span>
                        <span
                            title={
                                repeatMode === 0
                                    ? 'Không lặp lại'
                                    : repeatMode === 1
                                    ? 'Lặp lại 1 bài'
                                    : 'Lặp lại toàn bộ'
                            }
                            className={cx(!repeatMode ? 'isFalse' : 'isTrue')}
                            onClick={() => setRepeatMode((prev) => (prev === 2 ? 0 : prev + 1))}
                        >
                            {repeatMode === 1 ? <BsRepeat1 size={21} /> : <CiRepeat size={21} />}
                        </span>
                    </div>
                    <div className={cx('progress_bar')}>
                        <span className={cx('time_progress')}>{moment.utc(crSecond * 1000).format('mm:ss')}</span>
                        <div ref={trackref} className={cx('track')} onClick={handleClickProgesBar}>
                            <div ref={runTimeref} className={cx('run_time')}>
                                <div className={cx('run_time-dot')}></div>
                            </div>
                        </div>
                        <span className={cx('time_progress')}>
                            {moment.utc(songInfo?.duration * 1000).format('mm:ss')}
                        </span>
                    </div>
                </div>
                <div className={cx('volume')}>
                    <div className={cx('el_hover')}>
                        <BiWindows size={27} style={{ fontWeight: 200 }} />
                    </div>
                    <div className={cx('volume_zone')}>
                        <BsFillVolumeUpFill size={27} />
                        <div>
                            <Slider
                                defaultValue={volumes * 100}
                                onChange={onChangeValue}
                                className={cx('volume_action')}
                                tooltip={{
                                    formatter: null,
                                }}
                            />
                        </div>
                    </div>
                    <div className={cx('btn_playlist')}>
                        <div className={cx('playlist_action')} onClick={() => setIsShow((prev) => !prev)}>
                            <BiSolidPlaylist size={23} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayMusic;
