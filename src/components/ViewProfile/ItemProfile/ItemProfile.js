import React, { useEffect, useState } from 'react';
import { Col, Divider, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faCalendarDay, faVenusMars, faSignature } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ItemProfile.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import Btn from '~/components/Button';

const cx = classNames.bind(styles);
const style = {
    fontSize: 20,
    padding: '16px 8px',
    textAlign: 'center',
};
function ItemProfile({ data = {} }) {
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

    // const handleFollowUser = () => {
    //     const userId = data?.id;
    //     const fetchApi = async () => {
    //         const data = await config.followUser(userId, tokenStr);

    //         setIsFollowed(data.data.is_followed);
    //     };

    //     fetchApi();
    // };

    // const handleUnFollowUser = () => {
    //     const userId = data.id;
    //     const fetchApi = async () => {
    //         const data = await config.unFollowUser(userId, tokenStr);

    //         setIsFollowed(data.data.is_followed);
    //     };

    //     fetchApi();
    // };

    return (
        <>
            <Divider orientation="center" className={cx('divider')}>
                {userAuth?.id === data?.id ? (
                    <Menu
                        className={cx('menu')}
                        items={userMenu}
                        offset={[-70, 0]}
                        placement="left"
                    >
                        <Image className={cx('avatar')} src={data?.avatar?.url} />
                    </Menu>
                ) : (
                    <Image className={cx('avatar-hide')} src={data?.avatar?.url} />
                )}
            </Divider>

            <Row gutter={[16, 32]}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faSignature} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>NickName:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>{data?.nickName || 'Chưa cập nhật'}</div>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faCalendarDay} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>Ngày sinh:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>{data?.dateOfBirth || 'Chưa cập nhật'}</div>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faVenusMars} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>Giới tính:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>
                        {data?.gender !== undefined ? (data.gender ? 'Nam' : 'Nữ') : 'Chưa cập nhật'}
                    </div>
                </Col>
            </Row>
            <Divider orientation="right">
                {userAuth.id === data.id && (
                    <Btn onClick={handleOpenFormUpdate} className={cx('btn-upload')} outline medium>
                        Cập nhật
                    </Btn>
                )}
            </Divider>
        </>
    );
}

ItemProfile.propTypes = {
    data: PropTypes.object,
};

export default ItemProfile;
