import { Card, Carousel } from 'antd';
import classNames from 'classnames/bind';

import styles from './ViewHome.module.scss';
import MusicTop from './AccountTop';
import images from '~/assets/images';
import Image from '../Image';
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
                        <Card className={cx('carousel-card')}>
                            <div>
                                <Image src={images.banner1} />
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card className={cx('carousel-card')}>
                            <div>
                                <Image src={images.banner2} />
                            </div>
                        </Card>
                    </div>
                </Carousel>
            </div>

            <MusicTop />
        </div>
    );
}

export default ViewHome;
