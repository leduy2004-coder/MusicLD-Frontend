import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { useState } from 'react';
import Menu, { MenuItem } from './Menu';
import { HomeIcon, HomeActiveIcon, LiveIcon, LiveActiveIcon, SideBarIcon, MessageIcon } from '~/components/Icons';
import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar() {
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);

    const handleChange = () => {
        setShow(show ? false : true);
    };

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <div>
            {show ? (
                <aside className={cx('wrapper')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {hover && <SideBarIcon className={cx('action', 'action--hover')} onClick={handleChange} />}
                    <Menu>
                        <MenuItem title="Trang chủ" to={'/'} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                        <MenuItem
                            title="Nhạc đã đăng"
                            to={'/music/0'}
                            icon={<LiveIcon />}
                            activeIcon={<LiveActiveIcon />}
                        />
                        <MenuItem
                            title="ChatBox Gemini"
                            to={'/chatBox'}
                            icon={<MessageIcon />}
                            activeIcon={<MessageIcon  />}
                        />
                    </Menu>

                    <SuggestedAccounts label="Lời mời theo dõi" />
                </aside>
            ) : (
                <div className={cx('action')}>
                    <SideBarIcon onClick={handleChange} />
                </div>
            )}
        </div>
    );
}

export default Sidebar;
