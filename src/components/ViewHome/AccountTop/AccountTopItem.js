import { Card, Col } from 'antd';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Image from '~/components/Image';
import images from '~/assets/images';
import styles from './AccountTop.module.scss';

const { Meta } = Card;

const cx = classNames.bind(styles);

function MusicTopItem({ data = {}, order }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/profile/${data.id}`);
    };
    const getOrderImage = (order) => {
        switch (order) {
            case 1:
                return images.rankNumber1;
            case 2:
                return images.rankNumber2;
            case 3:
                return images.rankNumber3;
            case 4:
                return images.rankNumber4;
            case 5:
                return images.rankNumber5;
            case 6:
                return images.rankNumber6;
            default:
                return data?.avatar?.url || '/path/to/default-avatar.jpg';
        }
    };
    return (
        <Col span={4}>
            <div className={cx('image-wrapper')}>
                <Image alt="example" src={getOrderImage(order)} />
            </div>
            <Card hoverable onClick={handleCardClick} className={cx('card-wrapper')}>
                <div className={cx('card-body')}>
                    <div className={cx('avatar')}>
                        <Image alt="example" src={data?.avatar?.url} />
                    </div>
                    <Meta title={data?.nickName} className={cx('content')} />
                    <div className={cx('count-follow')}>
                        {data.countFollower}
                        <span>Người theo dõi</span>
                    </div>
                </div>
            </Card>
        </Col>
    );
}

MusicTopItem.propTypes = {
    data: PropTypes.object,
    statusFollow: PropTypes.string,
};

export default MusicTopItem;
