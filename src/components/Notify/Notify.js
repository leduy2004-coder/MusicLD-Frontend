import classNames from 'classnames/bind';
import styles from './Notify.module.scss';
import { Alert } from 'antd';
import { UserNotify } from '../Store';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Notify() {
    const { infoNotify } = UserNotify();

    const [isNotify, setIsNotify] = useState(infoNotify.isNotify);
    const [isEndAnimate, setIsEndAnimate] = useState(false);

    useEffect(() => {
        setIsNotify(infoNotify.isNotify);
        setIsEndAnimate(false);

        let timeoutEndAnimate = setTimeout(() => {
            setIsEndAnimate(true);
        }, infoNotify.delay);

        return () => {
            clearTimeout(timeoutEndAnimate);
        };
    }, [infoNotify]);


    return (
        <>
            {isNotify && (
                <div
                    className={cx('wrapper-notify', {'hide-notify': isEndAnimate,})}
                >
                   <Alert className={cx('alert')} message={infoNotify.content || 'Có lỗi xảy ra!'} type={infoNotify.type} showIcon closable />
                </div>
            )}
        </>
    );
}

export default Notify;
