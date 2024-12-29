import { Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Image from '~/components/Image';
import styles from './MusicTop.module.scss';

const cx = classNames.bind(styles);

function MusicTopItem({ data = {}, order }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        localStorage.setItem('selectedKey', 'nav1');
        navigate(`/music/${data.id}`);
    };
    return (
        <Col span={12}>
            <div className={cx('music-item')} onClick={handleCardClick}>
                <div className={cx('order')}>{order < 10 ? `0${order}` : order}</div>
                <div className={cx('avatar')}>
                    <Image alt="Avatar" src={data?.avatarResponse?.url} />
                </div>
                <div className={cx('info')}>
                    <div className={cx('title-content')}>{data?.title || 'Untitled'}</div>
                    <div className={cx('artist')}>{data?.nickName || 'Unknown Artist'}</div>
                </div>
                <div className={cx('duration')}>{data?.duration || '00:00'} giây</div>
                <div className={cx('more')}>...</div>
            </div>
        </Col>
    );
}

MusicTopItem.propTypes = {
    data: PropTypes.object,
    order: PropTypes.number,
};

export default MusicTopItem;
