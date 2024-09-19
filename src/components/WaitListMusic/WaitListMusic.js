import classNames from 'classnames/bind';
import styles from './WaitListMusic.module.scss';
import { useState } from 'react';
import { Empty, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import { UserMusic } from '../Store';
import WaitItemMusic from './WaitItemMusic';

const cx = classNames.bind(styles);

function WaitListMusic() {
    const { songs, currentSongId, setCurrentSongId, setAutoPlay } = UserMusic();
    const handlePlayMusic = (id) => {
        setCurrentSongId(id);
        setAutoPlay(true);
    };

    return (
        <aside className={cx('wrapper')}>
            <div className={cx('title')}>
                <FontAwesomeIcon className={cx('loading')} icon={faList} />
                Danh sách chờ
            </div>
            <div className={cx('list-music')}>
                {Array.isArray(songs) && songs.length > 0 ? (
                    songs.map((song) => (
                        <div key={song.id} onClick={() => handlePlayMusic(song.id)}>
                            <WaitItemMusic data={song} play={song.id === currentSongId} />
                        </div>
                    ))
                ) : (
                    <Empty
                        imageStyle={{
                            height: 220,
                        }}
                        description={
                            <Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa thêm nhạc</Typography.Text>
                        }
                    />
                )}
            </div>
        </aside>
    );
}

export default WaitListMusic;
