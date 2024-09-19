import classNames from 'classnames/bind';
import styles from './WaitListMusic.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import Image from '../Image';

const cx = classNames.bind(styles);

function WaitItemMusic({ data, play = false }) {
    return (
        <div className={cx('music')}>
            <div className={cx('avatar')}>
                <Image alt="example" src={data?.avatarResponse.url || ''} />
            </div>
            <h3 className={cx('meta-title')}>{data?.title || 'Unknown Title'}</h3>
            {play ? (
                <FontAwesomeIcon className={cx('icon-play')} icon={faVolumeHigh} />
            ) : (
                <FontAwesomeIcon className={cx('icon-play')} icon={faPlay} />
            )}
        </div>
    );
}

export default WaitItemMusic;
