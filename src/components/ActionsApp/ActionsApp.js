import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ActionsApp.module.scss';

import { ScrollOnTop } from '~/components/Icons';

import Button from '../Button';

const cx = classNames.bind(styles);

function ActionsApp() {
    const actionsRef = useRef();

    useEffect(() => {
        const handleScrollY = () => {
            if (window.scrollY >= 20) {
                actionsRef.current.style.transform = 'translateY(0)';
            } else {
                actionsRef.current.style.transform = 'translateY(40px)';
            }
        };

        window.addEventListener('scroll', handleScrollY);

        return () => {
            window.removeEventListener('scroll', handleScrollY);
        };
    }, []);

    const handleOnScroll = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };


    return (
        <div ref={actionsRef} className={cx('wrapper-actions')}>

            <div className={cx('div-btn')}>
                <Button primary onClick={handleOnScroll} className={cx('btn-scrolling')}>
                    <ScrollOnTop />
                </Button>
            </div>
        </div>
    );
}

export default ActionsApp;
