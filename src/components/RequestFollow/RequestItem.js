import React, { useState } from 'react';
import { Card, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { UserAuth } from '../Store';
import styles from './RequestFollow.module.scss';
import config from '~/services';
import Image from '~/components/Image';
import ButtonFollow from '~/components/Button/ButtonFollow';

const { Meta } = Card;

const cx = classNames.bind(styles);

function RequestItem({ data = {}, statusFollow }) {
    const { tokenStr } = UserAuth();
    const [followStatus, setFollowStatus] = useState(statusFollow);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    const handleFollowAction = (status) => {

        const userId = data.id;
        const updateFollowStatus = async () => {
            try {
                const response = await config.updateRequestFollowUser(userId, tokenStr, status);
                if (status === 'PENDING') setFollowStatus(status);
                else setFollowStatus('HIDE');
            } catch (error) {
                console.error('Failed to update follow status:', error);
            }
        };
        updateFollowStatus(status);
    };

    const handleCardClick = () => {
        if (followStatus !== 'HIDE') {
            navigate(`/profile/${data.id}`);
        }
    };

    return (
        <Col
            span={6}
            className={cx({
                hidden: followStatus === 'HIDE',
            })}
        >
            <Card hoverable onClick={handleCardClick}>
                <div className={cx('card-body')}>
                    <div className={cx('avatar')}>
                        <Image alt="example" src={data?.avatar?.url} />
                    </div>
                    <Meta title={data?.nickName} className={cx('content')} />
                    <div className={cx('count-follow')}>{data.countFollower} 
                        <span>Người theo dõi</span>
                    </div>
                    {followStatus === 'RECEIVED' ? (
                        <div className={cx('button-area')}>
                            <ButtonFollow
                                followStatus={'RECEIVED'}
                                profileUser={data}
                                className={classNames(cx('Btn-follow', 'access'))}
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
        </Col>
        
    );
}

RequestItem.propTypes = {
    data: PropTypes.object,
    statusFollow: PropTypes.string,
};

export default RequestItem;
