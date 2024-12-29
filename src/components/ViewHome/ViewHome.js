import { Card, Carousel } from 'antd';
import classNames from 'classnames/bind';

import styles from './ViewHome.module.scss';
import AccountTop from './AccountTop';
import MusicTop from './MusicTop';
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

            <AccountTop />
            <MusicTop />
        </div>
    );
}

export default ViewHome;
