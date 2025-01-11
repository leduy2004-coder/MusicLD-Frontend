import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    Pagination,
    PaginationItem,
    PaginationLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
} from 'reactstrap';
import { FaPlus, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from '~/services';
import { UserNotify, UserAuth } from '../Store';
import { musicAuth } from '../Store';
import UpdateMusicForm from '../FormAdmin/FormUpdateMusic';
import Image from '../Image';
const AdminMusic = () => {
    const [musics, setMusics] = useState([]);
    const [search, setSearch] = useState('');
    const [musicId, setMusicId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Điều khiển việc hiển thị modal xác nhận
    const [openFormAddMusic, setOpenFormAddMusic] = useState(false); // Điều khiển việc hiển thị modal xác nhận
    const [musicToDelete, setMusicToDelete] = useState(null); // Lưu thông tin phim cần xóa

    const { setInfoNotify } = UserNotify();
    const { tokenStr } = UserAuth();
    const itemsPerPage = 12;
    const navigate = useNavigate();

    //Gọi api lấy list phim
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await config.getAllMusic(tokenStr);

                if (data.errCode) {
                    setInfoNotify({
                        content: 'Lỗi dữ liệu !!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    setMusics(data.reverse());
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
    const filteredMusics = musics.filter(
        (music) => music.title && music.title.toLowerCase().includes(search.toLowerCase()),
    );

    // Phân trang
    const totalPages = Math.ceil(filteredMusics.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMusics = filteredMusics.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewDetails = (id) => {
        setMusicId(id);
        setOpenFormAddMusic(true);
    };

    const handOpenFormAdd = () => {
        setMusicId('');
        navigate(`/admin/music/add`);
    };

    // Hàm mở modal xác nhận xóa
    const handleOpenConfirmDelete = (musicId) => {
        setMusicToDelete(musicId);
        setShowConfirmDelete(true);
    };

    // Hàm xóa
    const handRemoveMusic = async () => {
        if (!musicToDelete) return;

        try {
            const data = await config.removeMusic(musicToDelete, tokenStr);

            if (data.errCode) {
                setInfoNotify({
                    content: 'Lỗi dữ liệu !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                // Lọc bỏ music bị xóa khỏi danh sách
                const updatedMusics = musics.filter((music) => music.id !== musicToDelete);
                setMusics(updatedMusics);
                setInfoNotify({
                    content: 'Nhạc đã được xóa thành công.',
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
            setMusicToDelete(null); // Reset thông tin phim cần xóa
        }
    };
    const handleMusicsUpdate = (updatedMusics) => {
        setMusics(updatedMusics);
    };
    const handleRowClick = (music) => {
        navigate(`/admin/music/detail/${music.id}`);
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
                        Thêm Nhạc
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col lg="12">
                    <Card>
                        <CardTitle tag="h4" className="border-bottom p-3 mb-0">
                            <i className="bi bi-card-text me-2"> </i>
                            Danh sách Nhạc
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
                                        <th>STT</th>
                                        <th>Ảnh nhạc</th>
                                        <th>Tên Nhạc</th>
                                        <th>Thời lượng</th>
                                        <th>Tên tác giả</th>
                                        <th>Số lượt thích</th>
                                        <th>Trạng thái</th>
                                        <th>Tình trạng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMusics.map((music, index) => (
                                        <tr
                                            key={music.id || index}
                                            onClick={() => handleRowClick(music)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <Image
                                                    src={music?.avatarResponse?.url}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                    }}
                                                    alt="Avatar"
                                                />
                                            </td>

                                            <td>{music.title}</td>
                                            <td>{music.duration}</td>
                                            <td>{music.nickName}</td>

                                            <td>{music?.countLike ?? 0}</td>
                                            <td>{music.access}</td>
                                            <td className="text-center align-middle">
                                                <span
                                                    className={`badge ${
                                                        music.status === true ? 'bg-success' : 'bg-danger'
                                                    }`}
                                                    style={{
                                                        fontSize: '12px',
                                                        padding: '8px 12px',
                                                        width: '125px',
                                                    }}
                                                >
                                                    {music.status === true ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                </span>
                                            </td>

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
                                                            handleViewDetails(music.id);
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
                                                            handleOpenConfirmDelete(music.id);
                                                        }}
                                                    >
                                                        <FaTrashAlt />
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </td>
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
                <ModalHeader toggle={() => setShowConfirmDelete(false)}>Xác nhận xóa nhạc</ModalHeader>
                <ModalBody>Bạn có chắc chắn muốn xóa nhạc này?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" size="lg" onClick={() => setShowConfirmDelete(false)}>
                        Hủy
                    </Button>
                    <Button color="danger" size="lg" onClick={handRemoveMusic}>
                        Xóa
                    </Button>
                </ModalFooter>
            </Modal>

            {openFormAddMusic && (
                <UpdateMusicForm
                    musicId={musicId}
                    musics={musics}
                    onMusicsUpdate={handleMusicsUpdate}
                    setOpenFormAddMusic={setOpenFormAddMusic}
                />
            )}
        </div>
    );
};

export default AdminMusic;
