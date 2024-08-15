import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from 'react-router-dom';

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { AddIcon, InboxIcon, MessageIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
// import Grid from 'antd/es/card/Grid';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { UserAuth } from '~/components/Store';

const cx = classNames.bind(styles);


function Header() {
    const navigate = useNavigate();
    const { userAuth, tokenStr, setOpenFormLogin, avatar } = UserAuth();
    const MENU_ITEMS = [];
    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Trang cá nhân',
            to: `/profile/${userAuth.id}`,
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
            component: true,
            separate: true,
        },
    ];
    const handleFormLogin = () => {
        userAuth && tokenStr ? navigate('/upload') : setOpenFormLogin(true);
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="Tiktok" />
                </Link>

                <Search />

                <div className={cx('actions')}>
                    <Button onClick={handleFormLogin} className={cx('btn-upload')} outline medium>
                        <AddIcon className={cx('add-icon')} />
                        Đăng
                        
                    </Button>
                    {userAuth && tokenStr ? (
                        <>
                            <div className={cx('btn-wrapper')}>
                                <Tippy delay={[0, 200]} content="Message" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <MessageIcon />
                                    </button>
                                </Tippy>
                            </div>
                            <div className={cx('btn-wrapper')}>
                                <Tippy delay={[0, 200]} content="Inbox" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <InboxIcon />
                                        <span className={cx('badge')}>12</span>
                                    </button>
                                </Tippy>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleFormLogin} primary medium>
                                Log in
                            </Button>
                        </>
                    )}
                    <Menu items={userAuth && tokenStr ? userMenu : MENU_ITEMS}>
                        {userAuth && tokenStr ? (
                            <Image
                                className={cx('user-avatar')}
                                src={avatar.url}
                                alt={userAuth.nickName}
                            />
                        ) : (
                            <></>
                        )}
                    </Menu>
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}

export default Header;
