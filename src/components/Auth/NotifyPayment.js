import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Auth.module.scss';

import { UserAuth } from '../Store/AuthContext';
import { useFormContext } from '../Store/FormContext';
import Button from '../Button';
import { Wrapper } from '../Popper';
import config from '../../services';
import { UserNotify } from '../Store';

const cx = classNames.bind(styles);

function NotifyPayment() {
    const navigate = useNavigate();

    const { tokenStr, setOpenFormNotifyPayment } = UserAuth();
    const {resetFormData } = useFormContext();

    const { setInfoNotify } = UserNotify();

    const handleCloseForm = () => {
        resetFormData();
        setOpenFormNotifyPayment(false);
    };

    const handleRedirect = async () => {
        const data = await config.getVNPay(15000, 'NCB', tokenStr);
        if (data && data.paymentUrl) window.location.href = data.paymentUrl;
    };

    return (
        <div className={cx('form-container')}>
            <Wrapper className={cx('form-logout')}>
                <div className={cx('logout-content')}>
                    <h1 className={cx('title-logout')}>Bạn chỉ được đăng 2 bài miễn phí </h1>
                    <span>Hãy thanh toán 15000 để đăng bài tiếp theo</span>
                    <div className={cx('btn-primary')}>
                        <Button onClick={handleCloseForm} className={cx('btn-form-logout')} large outline>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleRedirect}
                            className={cx('btn-form-logout', {
                                'logout-btn': true,
                            })}
                            large
                            outline
                        >
                            Thanh toán
                        </Button>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}

export default NotifyPayment;
