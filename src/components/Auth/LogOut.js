import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Auth.module.scss';

import { UserAuth } from '../Store/AuthContext';
import Button from '../Button';
import { Wrapper } from '../Popper';
import config from '../../services';
import { UserNotify } from '../Store';

const cx = classNames.bind(styles);

function LogOut() {
    const navigate = useNavigate();

    const { tokenStr, setOpenFormLogout } = UserAuth();
    const { setInfoNotify } = UserNotify();

    const handleCloseForm = () => {
        setOpenFormLogout(false);
    };

    const handleLogout = async () => {
        console.log(tokenStr)
        const data = await config.logout(tokenStr);

        if (data.errorCode) {
            setInfoNotify({
                content: 'Đăng xuất thất bại. Vui lòng thử lại!',
                delay: 1500,
                isNotify: true,
                type: 'error'
            });
            setOpenFormLogout(false);
        } else {
            setInfoNotify({
                content: 'Đăng xuất thành công!',
                delay: 1500,
                isNotify: true,
                type: 'success'
            });

            setTimeout(() => {
                localStorage.clear()

                navigate('/');
                window.location.reload();
            }, [300]);
        }
    };
    
    return (
        <div className={cx('form-container')}>
            <Wrapper className={cx('form-logout')}>
                <div className={cx('logout-content')}>
                    <h1 className={cx('title-logout')}>Bạn có chắc chắn muốn đăng xuất?</h1>
                    <div className={cx('btn-primary')}>
                        <Button onClick={handleCloseForm} className={cx('btn-form-logout')} large outline>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className={cx('btn-form-logout', {
                                'logout-btn': true,
                            })}
                            large
                            outline
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}

export default LogOut;
