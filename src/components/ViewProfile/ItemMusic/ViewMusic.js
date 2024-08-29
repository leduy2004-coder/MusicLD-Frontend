import React, { useState } from 'react';
import { Card, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ItemMusic.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import Image from '~/components/Image';
import Btn from '~/components/Button';

const cx = classNames.bind(styles);

function ViewMusic({ data = {}, statusFollow }) {
    const { tokenStr } = UserAuth();

    const [followStatus, setFollowStatus] = useState(statusFollow);

    const handleFollowAction = (status) => {
        const userId = data.id;
        const updateFollowStatus = async () => {
            try {
                console.log(status);
                const response = await config.updateRequestFollowUser(userId, tokenStr, status);
                if (status === 'PENDING') setFollowStatus(status);
                else setFollowStatus('HIDE');
            } catch (error) {
                console.error('Failed to update follow status:', error);
            }
        };
        updateFollowStatus(followStatus);
    };

    return (
        <Col span={24} className={cx('card')}>
            <Card hoverable>
                <div className={cx('card-body')}>
                    <div className={cx('number')}>1</div>
                    <div className={cx('avatar')}>
                        <Image alt="example" src={data?.avatar?.url} />
                    </div>

                    <h3 className={cx('meta-title')}>
                        Bao lời con chưa nói con mẹ mày chớ nói mày làm gì taao đám gãy mặt mày luôn con mẹ mày cút khỏi cuộc đồi tao nghe chưa
                    </h3>

                    <div className={cx('button-area')}>
                        <Btn leftIcon={<FontAwesomeIcon icon={faEdit} />} medium primary className={cx('button-edit')}>
                            Chỉnh sửa
                        </Btn>
                        <Btn
                            leftIcon={<FontAwesomeIcon icon={faRemove} />}
                            outline
                            medium
                            className={cx('button-edit')}
                        >
                            Xóa
                        </Btn>
                    </div>
                </div>
            </Card>
        </Col>
    );
}

ViewMusic.propTypes = {
    data: PropTypes.object,
};

export default ViewMusic;
