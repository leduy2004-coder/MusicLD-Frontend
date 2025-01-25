import { faCalendarDay, faSignature, faTrash, faUpload, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Divider, Row } from 'antd';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Btn from '~/components/Button';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import { UserAuth } from '../../Store';
import styles from './ItemProfile.module.scss';

const cx = classNames.bind(styles);
const style = {
    fontSize: 20,
    padding: '16px 8px',
    textAlign: 'center',
};
function ItemProfile({ data = {} }) {
    const { userAuth, tokenStr, setOpenFormEdit, avatar, setOpenFormChangePass } = UserAuth();

    const handleOpenFormUpdate = () => {
        setOpenFormEdit(true);
    };
    const handleOpenFormChangePassword = () => {
        setOpenFormChangePass(true);
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUpload} />,
            title: 'Thay ảnh',
            avatar: true,
        },

        ...(data?.avatar?.url
            ? [
                  {
                      icon: <FontAwesomeIcon icon={faTrash} />,
                      title: 'Xóa ảnh',
                      removeAvatar: true,
                  },
              ]
            : []),
    ];

    return (
        <>
            <Divider orientation="center" className={cx('divider')}>
                {userAuth?.id === data?.id ? (
                    <Menu className={cx('menu')} items={userMenu} offset={[-70, 0]} placement="left">
                        <Image className={cx('avatar')} src={data?.avatar?.url} />
                    </Menu>
                ) : (
                    <Image className={cx('avatar-hide')} src={data?.avatar?.url} />
                )}
            </Divider>

            <Row gutter={[16, 32]}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faSignature} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>NickName:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>{data?.nickName || 'Chưa cập nhật'}</div>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faCalendarDay} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>Ngày sinh:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>{data?.dateOfBirth || 'Chưa cập nhật'}</div>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={3}>
                    <div className={cx('icon-info')}>
                        <FontAwesomeIcon icon={faVenusMars} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div style={style}>Giới tính:</div>
                </Col>
                <Col className="gutter-row" span={9}>
                    <div style={style}>
                        {data?.gender !== undefined ? (data.gender ? 'Nam' : 'Nữ') : 'Chưa cập nhật'}
                    </div>
                </Col>
            </Row>
            <Divider orientation="right">
                {userAuth.id === data.id && (
                    <div className={cx('btn-info')}>
                        <Btn onClick={handleOpenFormUpdate} className={cx('btn-upload')} outline medium>
                            Cập nhật thông tin
                        </Btn>
                        {userAuth.email && (
                            <Btn onClick={handleOpenFormChangePassword} className={cx('btn-upload')} outline medium>
                                Đổi mật khẩu
                            </Btn>
                        )}
                    </div>
                )}
            </Divider>
        </>
    );
}

ItemProfile.propTypes = {
    data: PropTypes.object,
};

export default ItemProfile;
