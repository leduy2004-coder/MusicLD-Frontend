import React, { useState } from 'react';
import { Card, Col } from 'antd';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { UserAuth } from '../../Store';
import styles from './ItemFollow.module.scss';
import config from '../../../services';
import Image from '~/components/Image';
import ButtonFollow from '~/components/Button/ButtonFollow';

const { Meta } = Card;

const cx = classNames.bind(styles);

function ViewFollower({ data = {}, statusFollow }) {
    const { tokenStr } = UserAuth();
    const [followStatus, setFollowStatus] = useState(statusFollow);

    const handleFollowAction = (status) => {
        const userId = data.id;
        const updateFollowStatus = async () => {
            try {
                console.log(status);
                const response = await config.updateRequestFollowUser(userId,tokenStr, status);
                if (status === 'PENDING') setFollowStatus(status);
                else setFollowStatus('HIDE');
            } catch (error) {
                console.error('Failed to update follow status:', error);
            }
        };
        updateFollowStatus(followStatus);
    };

    return (
        <Col
            span={8}
            className={cx({
                hidden: followStatus === 'HIDE',
            })}
        >
            <Link to={`/profile/${data.id}`}>
                <Card hoverable>
                    <div className={cx('card-body')}>
                        <div className={cx('avatar')}>
                            <Image alt="example" src={data?.avatar?.url} />
                        </div>
                        <Meta title={data?.nickName} description="www.instagram.com" className={cx('content')} />

                        {followStatus === 'RECEIVED' ? (
                            <div className={cx('button-area')}>
                                <ButtonFollow
                                    followStatus={'RECEIVED'}
                                    profileUser={data}
                                    className={cx('Btn-follow')}
                                    handleFollowAction={handleFollowAction}
                                />
                                <ButtonFollow
                                    followStatus={'ACCEPTED'}
                                    profileUser={data}
                                    className={cx('Btn-follow')}
                                    handleFollowAction={handleFollowAction}
                                />
                            </div>
                        ) : (
                            <ButtonFollow
                                followStatus={followStatus}
                                profileUser={data}
                                className={cx('Btn-follow')}
                                handleFollowAction={handleFollowAction}
                            />
                        )}
                    </div>
                </Card>
            </Link>
        </Col>
    );
}

ViewFollower.propTypes = {
    data: PropTypes.object,
};

export default ViewFollower;
