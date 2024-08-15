import classNames from 'classnames/bind';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useState } from 'react';

import styles from './Auth.module.scss';
import Button from '../Button';
import { Wrapper } from '../Popper';
import { UserAuth } from '../Store';
import { UserNotify } from '../Store';
import { CloseTabs } from '../Control';
import config from '~/services';
const { Dragger } = Upload;
const cx = classNames.bind(styles);

function UploadAvatar() {
    const { userAuth, tokenStr, setOpenFormAvatar } = UserAuth();
    const { setInfoNotify } = UserNotify();
    const [fileToUpload, setFileToUpload] = useState(null);

    const handleCloseForm = () => {
        setOpenFormAvatar(false);
    };

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            setFileToUpload(info.fileList[0].originFileObj); // Lưu tệp vào state
        } else {
            setFileToUpload(null); // Xóa tệp nếu không có tệp nào
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) {
            setInfoNotify({
                content: 'Vui lòng chọn tệp để tải lên.',
                delay: 1500,
                isNotify: true,
                type: 'warning',
            });
            return;
        }

        const data = await config.uploadAvatar(fileToUpload, tokenStr);

        if (data.errCode) {
            setInfoNotify({
                content: 'Upload thất bại. Hãy thử lại !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        } else {
            setInfoNotify({
                content: 'Upload thành công',
                delay: 1500,
                isNotify: true,
                type: 'success',
            });
            localStorage.setItem('avatar', JSON.stringify(data.result));
        }
        setTimeout(() => {
            window.location.reload();
        }, [300]);
    };
  
    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        customRequest: ({ file, onSuccess, onError }) => {
            // Không thực hiện upload ngay lập tức
            onSuccess();
        },
        onChange: handleFileChange,
    };

    return (
        <div className={cx('form-wrapper')}>
            <section className={cx('modal-update')}>
                <Wrapper className={cx('main')}>
                    <header className={cx('header-update')}>
                        <h1 className={cx('header-title')}>Upload avatar</h1>
                        <div>
                            <CloseTabs onClick={handleCloseForm} />
                        </div>
                    </header>
                    <Dragger {...props} className={cx('ant-upload')}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                        <p className="ant-upload-hint">
                            Hỗ trợ tải lên một tệp đơn lẻ hoặc nhiều tệp. Tuyệt đối không được tải lên dữ liệu công ty
                            hoặc các tệp bị cấm khác.
                        </p>
                    </Dragger>
                    <footer className={cx('footer-update')}>
                        <Button onClick={handleCloseForm} outline medium className={cx('btn-form-update')}>
                            Thoát
                        </Button>
                        <Button
                            primary
                            medium
                            className={cx('btn-form-update')}
                            onClick={handleUpload}
                        >
                            Đăng
                        </Button>
                    </footer>
                </Wrapper>
            </section>
        </div>
    );
}

export default UploadAvatar;
