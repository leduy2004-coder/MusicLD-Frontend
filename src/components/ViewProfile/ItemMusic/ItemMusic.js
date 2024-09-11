import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faCalendarDay, faVenusMars, faSignature } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ItemMusic.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import Btn from '~/components/Button';
import ViewMusic from './ViewMusic';

const cx = classNames.bind(styles);

function ItemMusic({ data = {} }) {
    const { userAuth, tokenStr, setOpenFormEdit, avatar } = UserAuth();
    const [musics, setMusics] = useState([]);
    const [number, setNumber] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const musicsData = await config.getPlaylist(data.id, tokenStr);
                setMusics(musicsData.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data, tokenStr]);

    // Update the `number` state based on the length of `musics`
    useEffect(() => {
        if (Array.isArray(musics)) {
            setNumber(musics.length);
        }
    }, [musics]);

    return (
        <div className={cx('body')}>
            {Array.isArray(musics) && musics.length > 0 ? (
                <Row gutter={[16, 28]}>
                    {musics.map((music, index) => (
                        <ViewMusic key={music.id} data={music} number={index + 1} setMusics ={setMusics}/>
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

ItemMusic.propTypes = {
    data: PropTypes.object,
};

export default ItemMusic;
