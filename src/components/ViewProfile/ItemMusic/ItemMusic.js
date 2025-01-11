import React, { useEffect, useState } from 'react';
import { Row, Empty, Typography } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ItemMusic.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import ViewMusic from './ViewMusic';

const cx = classNames.bind(styles);

function ItemMusic({ data, playMusic = false, detailMusic = false }) {
    const { userAuth, tokenStr } = UserAuth();
    const [musics, setMusics] = useState([]);
    const [number, setNumber] = useState(0);

    useEffect(() => {
        // Xử lý data thành mảng nếu là object
        const processedData = Array.isArray(data) ? data : [data];

        if (playMusic) {
            setMusics(processedData);
        } else if (detailMusic) {
            setMusics(data);
        } else {
            const fetchData = async () => {
                try {
                    if (data?.id) {
                        const musicsData = await config.getPlaylist(data.id, tokenStr);
                        setMusics(musicsData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [data, tokenStr, playMusic]);

    useEffect(() => {
        if (Array.isArray(musics)) {
            setNumber(musics.length);
        }
    }, [musics]);

    return (
        <div
            className={cx({
                body: !playMusic && !detailMusic,
                'body-music': detailMusic,
            })}
        >
            {Array.isArray(musics) && musics.length > 0 ? (
                <Row gutter={[16, 28]}>
                    {musics.map((music, index) => (
                        <ViewMusic
                            key={music.id}
                            data={music}
                            number={index + 1}
                            setMusics={setMusics}
                            playMusic={playMusic}
                            detailMusic={detailMusic}
                        />
                    ))}
                </Row>
            ) : (
                <Empty
                    imageStyle={{
                        height: 220,
                    }}
                    description={
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa đăng nhạc</Typography.Text>
                    }
                />
            )}
        </div>
    );
}

export default ItemMusic;
