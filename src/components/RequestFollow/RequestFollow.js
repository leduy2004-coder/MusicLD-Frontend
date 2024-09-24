import React, { useEffect, useState } from 'react';
import { Tabs, Row, Empty, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserFriends,
    faUserPlus,
    faPersonMilitaryToPerson,
    faCodePullRequest,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './RequestFollow.module.scss';
import { UserAuth } from '../Store';
import config from '~/services';
import ViewFollower from '../ViewProfile/ItemFollow/ViewFollower';
import RequestItem from './RequestItem';

const cx = classNames.bind(styles);

function RequestFollow({ data = {} }) {
    const { userAuth, tokenStr } = UserAuth();

    const [receivedRequests, setReceivedRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const receivedRequestsData = await config.getAllReceive(userAuth.id, tokenStr);
                setReceivedRequests(receivedRequestsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data, tokenStr]);

    return (
        <div>
            {receivedRequests.length > 0 ? (
                <div>
                    <div className={cx('title')}>
                        <div className={cx('request')}>Lời mời theo dõi</div>
                        <div className={cx('count')}>{receivedRequests.length} lời mời</div>
                    </div>

                    <Row gutter={[8, 8]}>
                        {receivedRequests.map((request) => (
                            <RequestItem key={request.id} data={request} statusFollow={'RECEIVED'} />
                        ))}
                    </Row>
                </div>
            ) : (
                <Empty
                    imageStyle={{
                        height: 220,
                    }}
                    description={
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>Không có lời mời nào</Typography.Text>
                    }
                />
            )}
        </div>
    );
}

RequestFollow.propTypes = {
    data: PropTypes.object,
};

export default RequestFollow;
