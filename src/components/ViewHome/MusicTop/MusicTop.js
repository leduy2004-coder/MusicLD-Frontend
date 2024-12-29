import { useEffect, useState } from 'react';
import { Empty, Row, Typography } from 'antd';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { UserAuth } from '~/components/Store';
import config from '~/services';
import styles from './MusicTop.module.scss';

import MusicTopItem from './MusicTopItem';

const cx = classNames.bind(styles);

function MusicTop() {
    const { tokenStr } = UserAuth();
    const [topUser, setTopUser] = useState([]);

    useEffect(() => {
        if (tokenStr) {
            const fetchData = async () => {
                try {
                    const data = await config.getTopMusic(tokenStr);
                    if (data.errCode) {
                        console.log(data.errCode);
                    } else {
                        setTopUser(data.result);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [tokenStr]);

    return (
        <div>
            {Array.isArray(topUser) && topUser.length > 0 ? (
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>Top nhạc thịnh hành</div>
                    <Row gutter={[12, 12]}>
                        {topUser.map((request, index) => (
                            <MusicTopItem key={request.id} data={request} order={index + 1} />
                        ))}
                    </Row>
                </div>
            ) : (
                <Empty
                    imageStyle={{
                        height: 220,
                    }}
                    description={
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa có nhạc nào</Typography.Text>
                    }
                />
            )}
        </div>
    );
}

MusicTop.propTypes = {
    data: PropTypes.object,
};

export default MusicTop;
