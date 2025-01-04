import { useEffect, useState } from 'react';
import { Empty, Row, Typography } from 'antd';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { UserAuth } from '~/components/Store';
import config from '~/services';
import styles from './AccountTop.module.scss';

import MusicTopItem from './AccountTopItem';

const cx = classNames.bind(styles);

function MusicTop() {
    const [topUser, setTopUser] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await config.getTopUser();
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
    }, []);

    return (
        <div>
            {Array.isArray(topUser) && topUser.length > 0 ? (
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>Bảng xếp hạng tài khoản</div>
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
                        <Typography.Text style={{ color: 'red', fontSize: 20 }}>Chưa có tài khoản nào</Typography.Text>
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
