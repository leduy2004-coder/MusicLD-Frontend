import React from 'react';
import { Card, Col, Popconfirm, message } from 'antd'; // Import Popconfirm and message from Ant Design
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { UserNotify } from '../../Store';
import config from '~/services';
import { UserAuth } from '../../Store';
import styles from './ItemMusic.module.scss';
import Image from '~/components/Image';
import Btn from '~/components/Button';

const cx = classNames.bind(styles);

function ViewMusic({ data = {}, number = 0 }) {
    const { tokenStr, userAuth, setOpenFormLogin } = UserAuth();
    const { setInfoNotify } = UserNotify();
    console.log(data)
    const handleDelete = async (e) => {
        if (userAuth && tokenStr) {
            const result = await config.removeMusic(data.publicId, data?.avatarResponse?.publicId, data.id,tokenStr);

            if (result.errCode) {
                setInfoNotify({
                    content: 'Xóa thất bại. Hãy thử lại !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                setInfoNotify({
                    content: 'Xóa thành công',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });

                setTimeout(() => {
                    window.location.reload();
                }, [300]);
            }
        } else {
            setOpenFormLogin(true);
        }
    };

    return (
        <Col span={24} className={cx('card')}>
            <Card hoverable>
                <div className={cx('card-body')}>
                    <div className={cx('number')}>{number}</div>
                    <div className={cx('avatar')}>
                        <Image alt="example" src={data?.avatarResponse?.url} />
                    </div>

                    <h3 className={cx('meta-title')}>{data.title}</h3>

                    <div className={cx('button-area')}>
                        <Btn leftIcon={<FontAwesomeIcon icon={faEdit} />} medium primary className={cx('button-edit')}>
                            Chỉnh sửa
                        </Btn>

                        {/* Bọc nút "Xóa" bằng Popconfirm */}
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa bài hát này không?"
                            onConfirm={handleDelete}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Btn
                                leftIcon={<FontAwesomeIcon icon={faRemove} />}
                                outline
                                medium
                                className={cx('button-delete')}
                            >
                                Xóa
                            </Btn>
                        </Popconfirm>
                    </div>
                </div>
            </Card>
        </Col>
    );
}

ViewMusic.propTypes = {
    data: PropTypes.object,
};

export default ViewMusic;
