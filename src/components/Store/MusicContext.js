import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserNotify } from './NotifyContext';
const VideoContext = React.createContext();

export function UserMusic() {
    return useContext(VideoContext);
}

export function MusicProvider({ children }) {
    const [songs, setSongsState] = useState(() => {
        const storedSongs = localStorage.getItem('songs');
        return storedSongs ? JSON.parse(storedSongs) : [];
    });
    const { setInfoNotify } = UserNotify();
    const [profileUser, setProfileUser] = useState({});
    const [currentSongId, setCurrentSongId] = useState(null);
    const [autoPlay, setAutoPlay] = useState(false);
    const [followUser, setFollowUser] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [songInfo, setSongInfo] = useState(null);
    const [crSecond, setCrSecond] = useState(0);
    const [audio, setAudio] = useState(null); // Initialize to null
    const [volumes, setVolumes] = useState(0.5);
    const [isShuff, setIsShuff] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0);
    const runTimeref = useRef();
    const trackref = useRef();
    const [isShow, setIsShow] = useState(false);
    const [priorityMusic, setPriorityMusic] = useState(false);

    // Hàm thêm bài hát mới
    const addSong = (newSong) => {
        setSongsState((prevSongs) => {
            const songExists = songs.some((song) => song.id === newSong.id);
            if (songExists) {
                setInfoNotify({
                    content: 'Bài hát đã tồn tại trong danh sách !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
                return prevSongs;
            }
            const updatedSongs = [...prevSongs, newSong];
            localStorage.setItem('songs', JSON.stringify(updatedSongs));

            setTimeout(() => {
                setInfoNotify({
                    content: 'Thêm thành công !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
            }, 0);

            return updatedSongs;
        });
    };

    const removeSong = (index) => {
        setSongsState((prevSongs) => {
            if (index < 0 || index >= prevSongs.length) {
                setInfoNotify({
                    content: 'Bài hát không tồn tại trong danh sách !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
                return prevSongs;
            }
            const updatedSongs = prevSongs.filter((_, i) => i !== index);
            localStorage.setItem('songs', JSON.stringify(updatedSongs));

            if (currentSongId === prevSongs[index].id) {
                if (updatedSongs.length > 0) {
                    const nextSongIndex = index < updatedSongs.length ? index : 0;
                    setCurrentSongId(updatedSongs[nextSongIndex].id);
                    setAutoPlay(true);
                } else {
                    setCurrentSongId(null);
                    setAutoPlay(false);
                }
                setTimeout(() => {
                    setInfoNotify({
                        content: 'Xóa thành công !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'success',
                    });
                }, 0);
            }
            return updatedSongs;
        });
    };

    const value = {
        songs,
        addSong,
        removeSong, // Cung cấp hàm removeSong
        currentSongId,
        setCurrentSongId,
        autoPlay,
        setAutoPlay,
        followUser,
        setFollowUser,
        profileUser,
        setProfileUser,
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

        isShow,
        setIsShow,
        priorityMusic,
        setPriorityMusic
    };

    return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

MusicProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
