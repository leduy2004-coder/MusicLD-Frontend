import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import { NavLink } from 'react-router-dom';
import { UserAuth } from '../Store';
import config from '~/services';
import config2 from '~/config';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    const { userAuth, tokenStr } = UserAuth();
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading

    const lastSevenRequests = receivedRequests.slice(-7);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                if (userAuth != null) return;
                const receivedRequestsData = await config.getAllReceive(userAuth.id, tokenStr);
                
                setReceivedRequests(receivedRequestsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchData();
    }, [userAuth, tokenStr]);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {loading ? (
                <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
            ) : receivedRequests.length > 0 ? (
                <>
                    {lastSevenRequests.map((request) => (
                        <AccountItem key={request.id} data={request} statusFollow={'RECEIVED'} />
                    ))}
                    <NavLink className={cx('more-btn')} to={config2.routes.following}>
                        See all
                    </NavLink>
                </>
            ) : (
                <p className={cx('notify')}>Không có yêu cầu</p> 
            )}
        </div>
    );
}

SuggestedAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default SuggestedAccounts;
