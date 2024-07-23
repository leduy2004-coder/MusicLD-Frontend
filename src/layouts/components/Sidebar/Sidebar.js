import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { useState } from 'react';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
    SideBarIcon,
} from '~/components/Icons';
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
                        <MenuItem
                            title="For You"
                            to={config.routes.home}
                            icon={<HomeIcon />}
                            activeIcon={<HomeActiveIcon />}
                        />
                        <MenuItem
                            title="Following"
                            to={config.routes.following}
                            icon={<UserGroupIcon />}
                            activeIcon={<UserGroupActiveIcon />}
                        />
                        <MenuItem
                            title="LIVE"
                            to={config.routes.live}
                            icon={<LiveIcon />}
                            activeIcon={<LiveActiveIcon />}
                        />
                    </Menu>

                    <SuggestedAccounts label="Suggested accounts" />
                    <SuggestedAccounts label="Following accounts" />
                </aside>
            ) : (
                <div className={cx('action')}>
                    <SideBarIcon  onClick={handleChange} />
                </div>
            )}
        </div>
    );
}

export default Sidebar;
