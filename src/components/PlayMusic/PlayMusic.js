import React, { useEffect, useState, useRef } from 'react';
import config from '~/services';
import moment from 'moment';
import classNames from 'classnames/bind';
import icons from '~/utils/icon';
import { Slider } from 'antd';
import styles from './PlayMusic.module.scss';
import Image from '../Image';

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
} = icons;

let intervalID;

const PlayMusic = ({ setIsShow }) => {
    const [curIdSong, setCurIdSong] = useState(null);
    const [isPlay, setIsPlay] = useState(false);
    const [songs, setSongs] = useState([]);
    const [songInfo, setSongInfo] = useState(null);
    const [crsecond, setCrSecond] = useState(0);
    const [audio, setAudio] = useState(new Audio());
    const [volumes, setVolumes] = useState(0.5);
    const [isShuff, setIsShuff] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0);
    const runTimeref = useRef();
    const trackref = useRef();

    const onChangeValue = (value) => {
        setVolumes(value / 100);
        audio.volume = value / 100;
    };

    useEffect(() => {
        const fetchDetailSong = async () => {
            if (curIdSong) {
                const [res1, res2] = await Promise.all([config.getDetailSong(curIdSong), config.getSong(curIdSong)]);
                if (res1.data.err === 0 && res2.data.err === 0) {
                    setSongInfo(res1.data.data);
                    setAudio(new Audio(res2.data.data['128']));
                } else {
                    setAudio(new Audio());
                    setIsPlay(false);
                    setCrSecond(0);
                    runTimeref.current.style.cssText = `right: ${100}%`;
                }
            }
        };
        fetchDetailSong();
    }, [curIdSong]);

    useEffect(() => {
        intervalID && clearInterval(intervalID);
        if (audio && isPlay && runTimeref.current) {
            audio.play();
            audio.volume = volumes;
            intervalID = setInterval(() => {
                let percent = Math.round((audio.currentTime * 10000) / songInfo?.duration) / 100;
                runTimeref.current.style.cssText = `right: ${100 - percent}%`;
                setCrSecond(Math.round(audio.currentTime));
            }, 10);
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
                audio.play();
                setIsPlay(true);
            } else {
                handleNextSong();
            }
        };
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audio, isShuff, repeatMode]);

    const handlePlayMusic = () => {
        if (isPlay) {
            audio.pause();
            setIsPlay(false);
        } else {
            audio.play();
            setIsPlay(true);
        }
    };

    const handleClickProgesBar = (e) => {
        const tracRect = trackref.current.getBoundingClientRect();
        const percent = Math.round(((e.clientX - tracRect.left) * 10000) / tracRect.width) / 100;
        runTimeref.current.style.cssText = `right: ${100 - percent}%`;
        audio.currentTime = (percent * songInfo.duration) / 100;
        setCrSecond(Math.round((percent * songInfo.duration) / 100));
    };

    const handleNextSong = () => {
        if (songs) {
            let currentSongIndex;
            songs.forEach((item, index) => {
                if (item.encodeId === curIdSong) currentSongIndex = index;
            });

            if (isShuff) {
                handleShuff();
            } else {
                let idSongSelected = currentSongIndex;
                if (currentSongIndex === songs.length - 1) {
                    idSongSelected = 0;
                    setCurIdSong(songs[idSongSelected].encodeId);
                    setIsPlay(true);
                } else {
                    setCurIdSong(songs[currentSongIndex + 1].encodeId);
                    setIsPlay(true);
                }
            }
        }
    };

    const handlePrevSong = () => {
        if (songs) {
            let currentSongIndex;
            songs.forEach((item, index) => {
                if (item.encodeId === curIdSong) currentSongIndex = index;
            });
            let idSongPlay = currentSongIndex;
            if (currentSongIndex === 0) {
                idSongPlay = songs.length - 1;
                setCurIdSong(songs[idSongPlay].encodeId);
                setIsPlay(true);
            } else {
                setCurIdSong(songs[idSongPlay - 1].encodeId);
                setIsPlay(true);
            }
        }
    };

    const handleShuff = () => {
        const randomIndex = Math.floor(Math.random() * songs?.length);
        setCurIdSong(songs[randomIndex].encodeId);
        setIsPlay(true);
    };

    const handleRepeatOne = () => {
        audio.play();
    };

    return (
        <div className={cx('play_control')}>
            <div className={cx('detail_song')}>
                <div className={cx('ava_thumb')}>
                    <Image />
                </div>
                <div className={cx('song_infor')}>
                    <p>{songInfo?.title}</p>
                    <span>{songInfo?.artistsNames}</span>
                </div>
                <div className={cx('like_action')}>
                    <span>
                        <AiOutlineHeart size={21} />
                    </span>
                    <span>
                        <BiDotsHorizontalRounded size={21} />
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
                        title="Bật phát lại tất cả"
                        className={cx(!repeatMode ? 'isFalse' : 'isTrue')}
                        onClick={() => setRepeatMode((prev) => (prev === 2 ? 0 : prev + 1))}
                    >
                        {repeatMode === 1 ? <BsRepeat1 size={21} /> : <CiRepeat size={21} />}
                    </span>
                </div>
                <div className={cx('progress_bar')}>
                    <span className={cx('time_progress')}>{moment.utc(crsecond * 1000).format('mm:ss')}</span>
                    <div ref={trackref} className={cx('track')} onClick={handleClickProgesBar}>
                        <div ref={runTimeref} className={cx('run_time')}>
                            <div className={cx('run_time-dot')}></div>
                        </div>
                    </div>
                    <span className={cx('time_progress')}>{moment.utc(songInfo?.duration * 1000).format('mm:ss')}</span>
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
                            defaultValue={50}
                            onChange={onChangeValue}
                            className={cx('volume_action')}
                            tooltip={{
                                formatter: null,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayMusic;
