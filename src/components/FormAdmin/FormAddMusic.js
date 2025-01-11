import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import AdminUser from '../Admin_User';
import { UserAuth, UserNotify } from '../Store';
import UploadForm from '../Upload';
import './form.scss';

const FormAddMusic = () => {
    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const [selectedUser, setSelectedUser] = useState(null);

    // Hàm xử lý khi chọn user
    const handleUserSelect = (id) => {
        setSelectedUser(id); // Cập nhật state với ID của user được chọn
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Phần danh sách user bên trái */}
            <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '10px' }}>
                <AdminUser onUserSelect={handleUserSelect} />
            </div>

            {/* Phần UploadForm bên phải */}
            <div style={{ flex: 1.5, padding: '10px' }}>
                {selectedUser ? <UploadForm user={selectedUser} /> : <p>Chọn một user để bắt đầu upload</p>}
            </div>
        </div>
    );
};

export default FormAddMusic;
