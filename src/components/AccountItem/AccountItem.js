import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';

const cx = classNames.bind(styles);
function AccountItem({ data }) {
    return (
        <Link to={`/profile/${data.id}`} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data?.avatar?.url} alt={data.nickName} />
            <div className={cx('info')}>
                <p className={cx('name')}>
                    <span>{data.nickName}</span>
                </p>
                <span className={cx('username')}>{data.nickName}</span>
            </div>
        </Link>
    );
}

//check type data
AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;
