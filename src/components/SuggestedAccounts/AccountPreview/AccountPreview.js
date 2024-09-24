import React, { useState } from 'react';
import classNames from 'classnames/bind';

import Image from '~/components/Image';
import { UserAuth } from '~/components/Store';
import ButtonFollow from '~/components/Button/ButtonFollow';
import styles from './AccountPreview.module.scss';
import config from '~/services';

const cx = classNames.bind(styles);

function AccountPreview({ data = {} ,followStatus,onFollowStatusChange }) {
    const { tokenStr } = UserAuth();
    const [statusFollow, setStatusFollow] = useState(followStatus);
    const [userData, setUserData] = useState(data);

    const handleFollowAction = async (status) => {
        const userId = userData.id;
        try {
            const response = await config.updateRequestFollowUser(userId, tokenStr, status);
            if (response) {
                setStatusFollow(status);
                onFollowStatusChange('HIDE')
                setUserData((prevData) => ({
                    ...prevData,
                    statusFollower: status,
                }));
            }
        } catch (error) {
            console.error('Failed to update follow status:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Image alt="example" src={userData?.avatar?.url} className={cx('avatar')} />

                <ButtonFollow
                    followStatus={statusFollow}
                    profileUser={data}
                    className={classNames(cx('follow-btn', 'access'))}
                    handleFollowAction={handleFollowAction}
                />
            </div>
            <div className={cx('body')}>
                <p className={cx('nickname')}>
                    <strong>{userData?.nickName}</strong>
                </p>
                <p className={cx('analytics')}>
                    <strong className={cx('value')}>{data.countFollower}</strong>
                    <span className={cx('label')}>Người theo dõi</span>
                </p>
            </div>
        </div>
    );
}

export default AccountPreview;
