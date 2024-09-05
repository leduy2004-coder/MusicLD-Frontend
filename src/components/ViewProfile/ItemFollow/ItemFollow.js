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
import styles from './ItemFollow.module.scss';
import { UserAuth } from '../../Store';
import config from '../../../services';
import ViewFollower from './ViewFollower';

const cx = classNames.bind(styles);

function ItemFollow({ data = {} }) {
    const { userAuth, tokenStr } = UserAuth();

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [activeKey, setActiveKey] = useState('1');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const followersData = await config.getAllFollower(data.id,tokenStr);
                const followingData = await config.getAllFollowing(data.id,tokenStr);
                const receivedRequestsData = await config.getAllReceive(data.id,tokenStr);
                const sentRequestsData = await config.getAllRequest(data.id,tokenStr);

                setFollowers(followersData);
                setFollowing(followingData);
                setReceivedRequests(receivedRequestsData);
                setSentRequests(sentRequestsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data, tokenStr]);

    const tabsItems = [
        {
            key: '1',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '1', 'menu-item': activeKey !== '1' })}>
                    <FontAwesomeIcon icon={faUserFriends} /> Người theo dõi
                </span>
            ),
            children: (
                <div>
                    {followers.length > 0 ? (
                        <Row gutter={[8, 8]}>
                            {followers.map((follower) => (
                                <ViewFollower
                                    key={follower.id}
                                    data={follower}
                                    statusFollow={userAuth.id === data.id ? 'ACCEPTED' : 'NONE'}
                                />
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            imageStyle={{
                                height: 220,
                            }}
                            description={
                                <Typography.Text style={{ color: 'red', fontSize: 20 }}>
                                    Không có người theo dõi
                                </Typography.Text>
                            }
                        />
                    )}
          
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <span className={cx({ 'menu-item-selected': activeKey === '2', 'menu-item': activeKey !== '2' })}>
                    <FontAwesomeIcon icon={faPersonMilitaryToPerson} /> Đang theo dõi
                </span>
            ),
            children: (
                <div>
                    {following.length > 0 ? (
                        <Row gutter={[8, 8]}>
                            {following.map((followed) => (
                                <ViewFollower
                                    key={followed.id}
                                    data={followed}
                                    statusFollow={userAuth.id === data.id ? 'FRIEND' : 'NONE'}
                                />
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            imageStyle={{
                                height: 220,
                            }}
                            description={
                                <Typography.Text style={{ color: 'red', fontSize: 20 }}>
                                    Không có người nào bạn đang theo dõi
                                </Typography.Text>
                            }
                        />
                    )}
                </div>
            ),
        },
        ...(userAuth.id === data.id
            ? [
                  {
                      key: '3',
                      label: (
                          <span
                              className={cx({
                                  'menu-item-selected': activeKey === '3',
                                  'menu-item': activeKey !== '3',
                              })}
                          >
                              <FontAwesomeIcon icon={faUserPlus} /> Lời mời
                          </span>
                      ),
                      children: (
                          <div>
                              {receivedRequests.length > 0 ? (
                                  <Row gutter={[8, 8]}>
                                      {receivedRequests.map((request) => (
                                          <ViewFollower key={request.id} data={request} statusFollow={'RECEIVED'} />
                                      ))}
                                  </Row>
                              ) : (
                                  <Empty
                                      imageStyle={{
                                          height: 220,
                                      }}
                                      description={
                                          <Typography.Text style={{ color: 'red', fontSize: 20 }}>
                                              Không có lời mời nào
                                          </Typography.Text>
                                      }
                                  />
                              )}
                          </div>
                      ),
                  },
                  {
                      key: '4',
                      label: (
                          <span
                              className={cx({
                                  'menu-item-selected': activeKey === '4',
                                  'menu-item': activeKey !== '4',
                              })}
                          >
                              <FontAwesomeIcon icon={faCodePullRequest} /> Đã gửi yêu cầu
                          </span>
                      ),
                      children: (
                          <div>
                              {sentRequests.length > 0 ? (
                                  <Row gutter={[8, 8]}>
                                      {sentRequests.map((request) => (
                                          <ViewFollower key={request.id} data={request} statusFollow={'ACCEPTED'} />
                                      ))}
                                  </Row>
                              ) : (
                                  <Empty
                                      imageStyle={{
                                          height: 220,
                                      }}
                                      description={
                                          <Typography.Text style={{ color: 'red', fontSize: 20 }}>
                                              Không có yêu cầu nào đã gửi
                                          </Typography.Text>
                                      }
                                  />
                              )}
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={handleTabChange}
            items={tabsItems}
            className={styles.customTabs}
        />
    );
}

ItemFollow.propTypes = {
    data: PropTypes.object,
};

export default ItemFollow;
