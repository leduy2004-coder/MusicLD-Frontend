import { Card, Carousel } from 'antd';
import classNames from 'classnames/bind';

import styles from './ViewHome.module.scss';
import MusicTop from './AccountTop';

const cx = classNames.bind(styles);

function ViewHome() {
    return (
        <div className={cx('container')}>
            <div className={cx('slogan')}>
                <span>Sáng tác tự do</span>
                <span>Biến cảm hứng thành giai điệu</span>
            </div>

            <div className={cx('card-list')}>
                <Carousel arrows infinite={false} autoplay>
                    <div>
                        <Card className={cx('carousel-card')} title="Bài hát 1">
                            Nội dung bài hát 1
                        </Card>
                    </div>
                    <div>
                        <Card className={cx('carousel-card')} title="Bài hát 2">
                            Nội dung bài hát 2
                        </Card>
                    </div>
                </Carousel>
            </div>

            <MusicTop/>
        </div>
    );
}

export default ViewHome;
