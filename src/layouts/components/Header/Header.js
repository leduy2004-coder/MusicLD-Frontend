import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';

import Button from '~/components/Button';
import { AddIcon, InboxIcon, Logo, MessageIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import { useChat } from '~/components/Store/ChatContext';
import Search from '../Search';
import styles from './Header.module.scss';
// import Grid from 'antd/es/card/Grid';
import { UserAuth } from '~/components/Store';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const { userAuth, tokenStr, setOpenFormLogin, avatar, setOpenMessage } = UserAuth();
    const { getUnreadCount } = useChat();
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

    const handleOpenMess = () => {
        setOpenMessage(true);
    };
    const handleOpenChat = () => {
        navigate('/chatBox');
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to="/" className={cx('logo-link')}>
                    <Logo className={cx('logo')} />
                    {/* <img src={images.logo} alt="Tiktok" className={cx('logo')} /> */}
                </Link>

                <Search />

                <div className={cx('actions')}>
                    <Button onClick={handleFormLogin} className={cx('btn-upload')} outline medium>
                        <AddIcon className={cx('add-icon')} />
                        Đăng nhạc
                    </Button>
                    {userAuth && tokenStr ? (
                        <>
                            <div className={cx('btn-wrapper')}>
                                <Tippy delay={[0, 200]} content="Inbox" placement="bottom">
                                    <button className={cx('action-btn')} onClick={handleOpenMess}>
                                        <InboxIcon />
                                        <span className={cx('badge')}>{getUnreadCount()} </span>
                                    </button>
                                </Tippy>
                                <Tippy delay={[0, 200]} content="Gemini" placement="bottom">
                                    <button className={cx('action-btn')} onClick={handleOpenChat}>
                                        <MessageIcon />
                                    </button>
                                </Tippy>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleFormLogin} primary medium>
                                Đăng nhập
                            </Button>
                        </>
                    )}
                    <Menu items={userAuth && tokenStr ? userMenu : MENU_ITEMS}>
                        {userAuth && tokenStr ? (
                            <Image className={cx('user-avatar')} src={avatar.url} alt={userAuth.nickName} />
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
