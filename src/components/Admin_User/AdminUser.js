import { useEffect, useState } from 'react';
import { FaInfoCircle, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Table
} from 'reactstrap';
import config from '~/services';
import UpdateUserForm from '../FormAdmin/FormUser';
import Image from '../Image';
import { UserAuth, UserNotify } from '../Store';
const AdminUser = ({ onUserSelect }) => {
    console.log(onUserSelect);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Điều khiển việc hiển thị modal xác nhận
    const [openFormAddUser, setOpenFormAddUser] = useState(false); // Điều khiển việc hiển thị modal xác nhận
    const [userToDelete, setUserToDelete] = useState(null); // Lưu thông tin phim cần xóa

    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const itemsPerPage = 12;
    const navigate = useNavigate();

    //Gọi api lấy list phim
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await config.getAllUser(tokenStr);

                if (data.errCode) {
                    setInfoNotify({
                        content: 'Lỗi dữ liệu !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    if (onUserSelect) {
                        const filteredAndReversedUsers = data.filter((user) => user.status === true).reverse();
                        setUsers(filteredAndReversedUsers);
                    } else {
                        setUsers(data.reverse());
                    }
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
    }, [tokenStr]);

    // Hàm xử lý tìm kiếm
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    };

    // Lọc phim theo từ khóa tìm kiếm
    const filteredUsers = users.filter(
        (user) => user.nickName && user.nickName.toLowerCase().includes(search.toLowerCase()),
    );

    // Phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewDetails = (id) => {
        setUserId(id);
        setOpenFormAddUser(true);
    };

    const handOpenFormAdd = () => {
        setUserId('');
        setOpenFormAddUser(true);
    };

    // Hàm mở modal xác nhận xóa
    const handleOpenConfirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowConfirmDelete(true);
    };

    // Hàm xóa
    const handRemoveUser = async () => {
        if (!userToDelete) return;

        try {
            const data = await config.deleteUser(userToDelete, tokenStr);

            if (data.errCode) {
                setInfoNotify({
                    content: 'Lỗi dữ liệu !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                // Lọc bỏ user bị xóa khỏi danh sách
                const updatedUsers = users.filter((user) => user.id !== userToDelete);
                setUsers(updatedUsers);
                setInfoNotify({
                    content: 'Tài khoản đã được xóa thành công.',
                    delay: 1500,
                    isNotify: true,
                    type: 'success',
                });
            }
        } catch (error) {
            setInfoNotify({
                content: 'Lỗi khi lấy dữ liệu từ server !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        } finally {
            setShowConfirmDelete(false); // Đóng modal xác nhận sau khi thực hiện
            setUserToDelete(null); // Reset thông tin phim cần xóa
        }
    };
    const handleUsersUpdate = (updatedUsers) => {
        setUsers(updatedUsers);
    };
    const handleRowClick = (user) => {
        console.log('Selected user user:', user);
        if (onUserSelect) {
            onUserSelect(user);
        } else {
            console.log('giao dien');
        }
    };

    return (
        <div>
            {/* Thanh tìm kiếm và nút thêm */}
            <Row className="mb-4 align-items-center">
                <Col md="9">
                    <InputGroup>
                        <Input
                            placeholder="Tìm kiếm theo tên ..."
                            value={search}
                            onChange={handleSearch}
                            style={{
                                fontSize: '15px',
                                padding: '5px',
                            }}
                        />
                        <InputGroupText style={{ fontSize: '15px' }}>
                            <i className="bi bi-search"></i>
                        </InputGroupText>
                    </InputGroup>
                </Col>
                {!onUserSelect && (
                    <Col md="3" className="text-end">
                        <Button
                            color="primary"
                            onClick={handOpenFormAdd}
                            style={{
                                fontSize: '15px',
                                padding: '5px 20px',
                            }}
                        >
                            <FaPlus style={{ fontSize: '12px', marginRight: '8px' }} />
                            Thêm tài khoản
                        </Button>
                    </Col>
                )}
            </Row>

            <Row>
                <Col lg="12">
                    <Card>
                        <CardTitle tag="h4" className="border-bottom p-3 mb-0">
                            <i className="bi bi-card-text me-2"> </i>
                            Danh sách tài khoản
                        </CardTitle>
                        <CardBody className="">
                            <Table
                                bordered
                                hover
                                style={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                <thead>
                                    <tr>
                                        {!onUserSelect && <th>STT</th>}
                                        <th>Ảnh đại diện</th>
                                        <th>Tên tài khoản</th>
                                        {!onUserSelect && <th>Ngày sinh</th>}
                                        <th>Giới tính</th>
                                        <th>Lượng follow</th>
                                        {!onUserSelect && (
                                            <>
                                                <th>Tình trạng</th>
                                                <th>Hành động</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user, index) => (
                                        <tr
                                            key={user.id || index}
                                            onClick={() => handleRowClick(user)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {!onUserSelect && <th scope="row">{index + 1}</th>}
                                            <td>
                                                <Image
                                                    src={user?.avatar?.url}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                    }}
                                                    alt="Avatar"
                                                />
                                            </td>

                                            <td>{user.nickName}</td>
                                            {!onUserSelect && <td>{user.dateOfBirth}</td>}
                                            <td>
                                                {user.gender === true
                                                    ? 'Nam'
                                                    : user.gender === false
                                                    ? 'Nữ'
                                                    : 'Không xác định'}
                                            </td>

                                            <td>{user?.countFollower ?? 0}</td>
                                            <td className="text-center align-middle">
                                                <span
                                                    className={`badge ${
                                                        user.status === true ? 'bg-success' : 'bg-danger'
                                                    }`}
                                                    style={{
                                                        fontSize: '12px',
                                                        padding: '8px 12px',
                                                        width: '125px',
                                                    }}
                                                >
                                                    {user.status === true ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                </span>
                                            </td>
                                            {!onUserSelect && (
                                                <td className="text-center align-middle">
                                                    <div
                                                        className="d-flex justify-content-center  align-items-center"
                                                        style={{ gap: '10px' }}
                                                    >
                                                        <Button
                                                            color="info"
                                                            size="sm"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                fontSize: '12px',
                                                                padding: '8px 12px',
                                                                gap: '5px', // Khoảng cách giữa icon và chữ
                                                            }}
                                                            onClick={(event) => {
                                                                event.stopPropagation(); // Ngăn sự kiện nổi lên
                                                                handleViewDetails(user.id);
                                                            }}
                                                        >
                                                            <FaInfoCircle />
                                                            Chỉnh sửa
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                fontSize: '12px',
                                                                padding: '8px 12px',
                                                                gap: '5px', // Khoảng cách giữa icon và chữ
                                                            }}
                                                            onClick={(event) => {
                                                                event.stopPropagation(); // Ngăn sự kiện nổi lên
                                                                handleOpenConfirmDelete(user.id);
                                                            }}
                                                        >
                                                            <FaTrashAlt />
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Phân trang */}
            <Row>
                <Col>
                    <Pagination className="justify-content-center fs-3">
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                                previous
                                className="fs-3"
                                onClick={() => handlePageChange(currentPage - 1)}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <PaginationItem key={index + 1} active={currentPage === index + 1}>
                                <PaginationLink className="fs-3" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink next className="fs-3" onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                    </Pagination>
                </Col>
            </Row>

            {/* Modal xác nhận xóa */}
            <Modal isOpen={showConfirmDelete} toggle={() => setShowConfirmDelete(false)}>
                <ModalHeader toggle={() => setShowConfirmDelete(false)}>Xác nhận xóa tài khoản</ModalHeader>
                <ModalBody>Bạn có chắc chắn muốn xóa tài khoản này?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" size="lg" onClick={() => setShowConfirmDelete(false)}>
                        Hủy
                    </Button>
                    <Button color="danger" size="lg" onClick={handRemoveUser}>
                        Xóa
                    </Button>
                </ModalFooter>
            </Modal>

            {openFormAddUser && (
                <UpdateUserForm
                    userId={userId}
                    users={users}
                    onUsersUpdate={handleUsersUpdate}
                    setOpenFormAddUser={setOpenFormAddUser}
                />
            )}
        </div>
    );
};

export default AdminUser;
