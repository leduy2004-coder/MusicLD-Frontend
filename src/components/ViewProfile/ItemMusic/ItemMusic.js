import React, { useEffect, useState } from 'react';
import { Col, Divider, Row } from 'antd';
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
const style = {
    fontSize: 20,
    padding: '16px 8px',
    textAlign: 'center',
};
function ItemMusic({ data = {} }) {
    const { userAuth, tokenStr, setOpenFormEdit, avatar } = UserAuth();

    // const [isFollowed, setIsFollowed] = useState(data?.is_followed);

    // useEffect(() => {
    //     setIsFollowed(data?.is_followed);
    // }, [data]);

    const handleOpenFormUpdate = () => {
        setOpenFormEdit(true);
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUpload} />,
            title: 'Thay ảnh',
            avatar: true,
        },
        {
            icon: <FontAwesomeIcon icon={faTrash} />,
            title: 'Xóa ảnh',
            removeAvatar: true,
        },
    ];

    return (
        <div className={cx('body')}>
            <Row gutter={[16, 28]}>
                <ViewMusic/>
                <ViewMusic/>
                <ViewMusic/>
                <ViewMusic/>
                <ViewMusic/>
            </Row>

        </div>
    );
}

ItemMusic.propTypes = {
    data: PropTypes.object,
};

export default ItemMusic;
