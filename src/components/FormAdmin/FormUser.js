import { useEffect, useState } from 'react';
import { Button, Card, CardTitle, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import config from '~/services';
import { UserAuth, UserNotify } from '../Store';
import './form.scss';

const UpdateUserForm = ({ userId, users, onUsersUpdate, setOpenFormAddUser }) => {
    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const [selectedFile, setSelectedFile] = useState(false);

    const [userDetail, setUserDetail] = useState({
        username: '',
        password: '',
        nickName: '',
        dateOfBirth: '',
        avatar: null,
        gender: false,
        status: false,
    });

    useEffect(() => {
        if (!userId) {
            return;
        }
        const fetchData = async () => {
            try {
                const data = await config.getUserForAdmin(userId, tokenStr);
                if (data.errCode) {
                    setInfoNotify({
                        content: 'Lỗi dữ liệu !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    const mappedData = {
                        username: data.username || '',
                        nickName: data.nickName || '',
                        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('/').reverse().join('-') : '',
                        avatar: data.avatar || null,
                        gender: data.gender,
                        status: data.status,
                    };
                    setSelectedFile(true);

                    setUserDetail(mappedData);
                }
            } catch (error) {
                setInfoNotify({
                    content: 'Lỗi khi lấy dữ liệu từ server !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            }
        };
        if (tokenStr) fetchData();
    }, [userId, tokenStr]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetail((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(false);

        const { name, files } = e.target;
        setUserDetail((prev) => ({ ...prev, [name]: files[0] }));
    };
    const handleChangeStatus = (e) => {
        const { name, type, checked } = e.target;

        setUserDetail((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : prevDetails[name], // Duy trì giá trị cũ nếu không phải checkbox
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data, dataAvatar;
            let actionMessage = '';

            // Reformat the date from 'yyyy-MM-dd' to 'dd/MM/yyyy'
            const formattedDateOfBirth = new Date(userDetail.dateOfBirth);
            const formattedDate = `${formattedDateOfBirth.getDate().toString().padStart(2, '0')}/${(
                formattedDateOfBirth.getMonth() + 1
            )
                .toString()
                .padStart(2, '0')}/${formattedDateOfBirth.getFullYear()}`;

            // Update the user details with the formatted date
            const updatedUserDetail = { ...userDetail, dateOfBirth: formattedDate };

            if (userId) {
                data = await config.updateUser(
                    tokenStr,
                    updatedUserDetail.username,
                    updatedUserDetail.password,
                    updatedUserDetail.nickName,
                    updatedUserDetail.gender,
                    updatedUserDetail.dateOfBirth,
                    userId,
                );
                if (updatedUserDetail.avatar && !selectedFile) {
                    dataAvatar = await config.uploadAvatarUser(updatedUserDetail.avatar, userId, tokenStr);
                    console.log(dataAvatar)

                    data = { ...data, avatar: dataAvatar };
                }else {
                    data = { ...data, avatar: userDetail.avatar };
                }
                actionMessage = 'Cập nhật tài khoản thành công !!';
            } else {
                data = await config.addUser(
                    updatedUserDetail.username,
                    updatedUserDetail.password,
                    updatedUserDetail.nickName,
                    updatedUserDetail.dateOfBirth,
                    updatedUserDetail.gender,
                    'USER',
                );

                if (updatedUserDetail.avatar && !selectedFile) {
                    dataAvatar = await config.uploadAvatarUser(
                        updatedUserDetail.avatar,
                        data.id,
                        tokenStr,
                    );
                    console.log(dataAvatar)
                    data = { ...data, avatar: dataAvatar };
                }
                actionMessage = 'Thêm tài khoản thành công !!';
            }

            if (data.errCode) {
                setInfoNotify({
                    content: 'Lỗi dữ liệu !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
                return;
            }
            // Cập nhật danh sách users
            const updatedUsers = userId
                ? users.map((user) => (user.id === userId ? { ...user, ...data } : user))
                : [data, ...(users || [])];
            onUsersUpdate(updatedUsers); // Cập nhật state ở cha
            setOpenFormAddUser(false); // Đóng form

            setInfoNotify({
                content: actionMessage,
                delay: 1500,
                isNotify: true,
                type: 'success',
            });
        } catch (error) {
            setInfoNotify({
                content: 'Lỗi khi lấy dữ liệu từ server !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        }
    };

    const handleClose = () => {
        setOpenFormAddUser(false);
    };

    return (
        <div className="background-form p-5">
            <Row>
                <Col>
                    <Card className="form-card p-4">
                        <div className="form-content">
                            <div className="area-close text-end">
                                <span className="close-btn fs-3" onClick={handleClose} role="button" aria-label="Close">
                                    &times;
                                </span>
                            </div>
                            <CardTitle tag="h2" className="text-center mb-4 fs-1" style={{ color: 'red' }}>
                                {userId ? 'Cập nhật tài khoản' : 'Thêm mới tài khoản'}
                            </CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="username" className="fs-3">
                                                Tài khoản
                                            </Label>
                                            <Input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={userDetail.username}
                                                onChange={handleChange}
                                                placeholder="Nhập tài khoản"
                                                className="p-3 fs-3"
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password" className="fs-3">
                                                {userId ? 'Nhập mật khẩu mới' : 'Mật khẩu'}
                                            </Label>
                                            <Input
                                                type="text"
                                                id="password"
                                                name="password"
                                                value={userDetail.password}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu mới"
                                                className="p-3 fs-3"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="nickName" className="fs-3">
                                                Tên tài khoản
                                            </Label>
                                            <Input
                                                type="text"
                                                id="nickName"
                                                name="nickName"
                                                value={userDetail.nickName}
                                                onChange={handleChange}
                                                placeholder="Nhập tên tài khoản"
                                                className="p-3 fs-3"
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="dateOfBirth" className="fs-3">
                                                Ngày sinh
                                            </Label>
                                            <Input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={userDetail.dateOfBirth}
                                                onChange={handleChange}
                                                className="p-3 fs-3"
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="gender">Giới tính</Label>
                                            <Input
                                                type="select"
                                                id="gender"
                                                name="gender"
                                                value={userDetail.gender} // Giá trị hiện tại
                                                className="p-3 fs-3"
                                                onChange={handleChange} // Hàm xử lý khi thay đổi
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="true">Nam</option>
                                                <option value="false">Nữ</option>
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="status" className="fs-3 me-3">
                                                Tình trạng
                                            </Label>
                                            <Input
                                                type="checkbox"
                                                id="status"
                                                name="status"
                                                checked={userDetail.status}
                                                onChange={handleChangeStatus}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="avatar" className="fs-3">
                                                Ảnh đại diện
                                            </Label>
                                            <div className="file-upload mt-2">
                                                {userDetail.avatar && selectedFile && (
                                                    <img
                                                        src={userDetail?.avatar?.url}
                                                        alt="Avatar"
                                                        className="mb-3"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                )}
                                                <Input
                                                    type="file"
                                                    id="avatar"
                                                    name="avatar"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="form-control fs-3"
                                                />
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="area-btn-submit text-center mt-4">
                                    <Button className="btn-submit btn-lg" type="submit">
                                        {userId ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UpdateUserForm;
