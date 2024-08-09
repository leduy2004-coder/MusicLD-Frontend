import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import styles from './Menu.module.scss';
import { UserAuth } from '~/components/Store';
const cx = classNames.bind(styles);

const defaultFn = () => {};

function Menu({ children,className, items = [], offset=[12,8],placement='bottom-end', hideOnClick = false, onChange = defaultFn }) {
    const { setOpenFormLogout,setOpenFormAvatar } = UserAuth();

    const renderItems = () => {
        return items.map((item, index) => {
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        if (item.component) {
                            setOpenFormLogout(true);
                        }else if(item.avatar){
                            setOpenFormAvatar(true)
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    const renderResult = (attrs) => (
        <div className={cx('menu-list',className)} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')}>
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    return (
        <div>
            <Tippy
                interactive
                delay={[0, 700]}
                offset={offset}
                hideOnClick={hideOnClick}
                placement={placement}
                render={renderResult}
            >
                {children}
            </Tippy>
        </div>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Menu;
