import React, { useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import Image from '../Image';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from './AccountPreview/AccountPreview';
import styles from './SuggestedAccounts.module.scss';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    const [followStatus, setFollowStatus] = useState('RECEIVED');

    const handleFollowStatusChange = (newStatus) => {
        setFollowStatus(newStatus); 
    };

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data} followStatus={followStatus} onFollowStatusChange={handleFollowStatusChange} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <div
            className={cx({
                hidden: followStatus === 'HIDE', // Ẩn khi trạng thái là "hide"
            })}
        >
            <Tippy interactive delay={[800, 0]} offset={[-20, 0]} placement="bottom" render={renderPreview}>
                <div className={cx('account-item')}>
                    <Image alt="example" src={data?.avatar?.url} className={cx('avatar')} />
                    <div className={cx('item-info')}>
                        <p className={cx('nickname')}>
                            <strong>{data?.nickName}</strong>
                        </p>
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

AccountItem.propTypes = {};

export default AccountItem;
