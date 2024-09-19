import React, { useState } from 'react';
import { Card, Col, Popconfirm, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { UserMusic, UserNotify } from '../../Store';
import config from '~/services';
import { UserAuth } from '../../Store';
import styles from './ItemMusic.module.scss';
import Image from '~/components/Image'; 
import Btn from '~/components/Button';
import EditFormMusic from './EditFormMusic';

const cx = classNames.bind(styles);

function ViewMusic({ data = {}, number = 0, setMusics, playMusic = false }) {
    const { tokenStr, userAuth, setOpenFormLogin } = UserAuth();
    const { setInfoNotify } = UserNotify();
    const [isEditVisible, setIsEditVisible] = useState(false);
    const { addSong } = UserMusic();

    const handleDelete = async () => {
        if (userAuth && tokenStr) {
            try {
                const result = await config.removeMusic(
                    data.publicId,
                    data?.avatarResponse?.publicId,
                    data.id,
                    tokenStr,
                );

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

                    // Update the music list without refreshing the page
                    setMusics((prevMusics) => prevMusics.filter((music) => music.id !== data.id));
                }
            } catch (error) {
                message.error('Có lỗi xảy ra. Vui lòng thử lại!');
            }
        } else {
            setOpenFormLogin(true);
        }
    };
    const handlePlayMusic = () => {
        
    };
    const handleAddMusic = (newSong) => {
        addSong(newSong);

    }
    return (
        <Col span={18}>
            <Card hoverable onClick={playMusic ? handlePlayMusic : undefined} >
                <div className={cx(playMusic ? 'card-play' : 'card-body')}>
                    <div className={cx('number')}>{number}</div>
                    <div className={cx('avatar')}>
                        <Image alt="example" src={data?.avatarResponse?.url} />
                    </div>

                    <h3 className={cx('meta-title')}>{data.title}</h3>

                    <div className={cx('button-area')}>
                        {playMusic ? (
                            <Btn
                                leftIcon={<FontAwesomeIcon icon={faAdd} />}
                                medium
                                primary
                                className={cx('button-edit')}
                                onClick={() => handleAddMusic(data)}
                            >
                                Thêm vào list nhạc
                            </Btn>
                        ) : (
                            <>
                                <Btn
                                    leftIcon={<FontAwesomeIcon icon={faEdit} />}
                                    medium
                                    primary
                                    className={cx('button-edit')}
                                    onClick={() => setIsEditVisible(true)}
                                >
                                    Chỉnh sửa
                                </Btn>

                                {/* Wrap "Delete" button in Popconfirm */}
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
                            </>
                        )}
                    </div>
                </div>
            </Card>
            <EditFormMusic
                visible={isEditVisible}
                onCancel={() => setIsEditVisible(false)}
                musicData={data}
                tokenStr={tokenStr}
                setMusics={setMusics}
            />
        </Col>
    );
}

ViewMusic.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        avatarResponse: PropTypes.shape({
            url: PropTypes.string,
            publicId: PropTypes.string,
        }),
        publicId: PropTypes.string,
    }).isRequired,
    number: PropTypes.number,
    setMusics: PropTypes.func.isRequired,
    playMusic: PropTypes.bool,
};

export default ViewMusic;
