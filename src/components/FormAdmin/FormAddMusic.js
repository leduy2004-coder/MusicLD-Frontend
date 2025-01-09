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
   

    // useEffect(() => {
    //     if (!musicId) {
    //         return;
    //     }
    //     const fetchData = async () => {
    //         try {
    //             const data = await config.getUserForAdmin(musicId, tokenStr);
    //             if (data.errCode) {
    //                 setInfoNotify({
    //                     content: 'Lỗi dữ liệu !!',
    //                     delay: 1500,
    //                     isNotify: true,
    //                     type: 'error',
    //                 });
    //             } else {
    //                 const mappedData = {
    //                     title: data.title || '',
    //                     lyrics: data.lyrics || '',
    //                     avatar: data.avatar || null,
    //                     status: data.status,
    //                 };
        
    //             }
    //         } catch (error) {
    //             setInfoNotify({
    //                 content: 'Lỗi khi lấy dữ liệu từ server !!',
    //                 delay: 1500,
    //                 isNotify: true,
    //                 type: 'error',
    //             });
    //         }
    //     };
    //     if (tokenStr) fetchData();
    // }, [musicId, tokenStr]);


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         let data, dataAvatar;
    //         let actionMessage = '';

    //         data = await config.addUser(
    //             musicDetail.title,
    //             musicDetail.lyrics,
    //             musicDetail.title,
    //             musicDetail.dateOfBirth,
    //             musicDetail.gender,
    //             'USER',
    //         );

    //         if (musicDetail.avatar && !selectedFile) {
    //             dataAvatar = await config.uploadAvatarUser(musicDetail.avatar, data.id, tokenStr);
    //             console.log(dataAvatar);
    //             data = { ...data, avatar: dataAvatar };
    //         }
    //         actionMessage = 'Thêm nhạc thành công !!';

    //         if (data.errCode) {
    //             setInfoNotify({
    //                 content: 'Lỗi dữ liệu !!',
    //                 delay: 1500,
    //                 isNotify: true,
    //                 type: 'error',
    //             });
    //             return;
    //         }
    //         // Cập nhật danh sách musics
    //         const updatedMusics = [data, ...(musics || [])];
    //         onMusicsUpdate(updatedMusics); // Cập nhật state ở cha
    //         setOpenFormAddMusic(false); // Đóng form

    //         setInfoNotify({
    //             content: actionMessage,
    //             delay: 1500,
    //             isNotify: true,
    //             type: 'success',
    //         });
    //     } catch (error) {
    //         setInfoNotify({
    //             content: 'Lỗi khi lấy dữ liệu từ server !!',
    //             delay: 1500,
    //             isNotify: true,
    //             type: 'error',
    //         });
    //     }
    // };

    // const handleClose = () => {
    //     setOpenFormAddMusic(false);
    // };



    return (
        <div style={{ display: 'flex' }}>
            {/* Phần danh sách user bên trái */}
            <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '10px' }}>
                <AdminUser onUserSelect={handleUserSelect}/>
            </div>

            {/* Phần UploadForm bên phải */}
            <div style={{ flex: 1.5, padding: '10px' }}>
                {selectedUser ? <UploadForm user={selectedUser} /> : <p>Chọn một user để bắt đầu upload</p>}
            </div>
        </div>
    );
};

export default FormAddMusic;
