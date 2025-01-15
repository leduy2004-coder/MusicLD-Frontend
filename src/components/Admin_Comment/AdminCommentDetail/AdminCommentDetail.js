import React, { useEffect, useState } from 'react';
import { Typography, Button, List, Divider, Modal, Input, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminCommentDetail.module.scss';
import config from '~/services';
import { UserAuth } from '~/components/Store';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const AdminCommentDetail = () => {
    const { id } = useParams();
    const { tokenStr } = UserAuth();
    const navigate = useNavigate();

    const [comments, setComments] = useState(null);
    const [author, setAuthor] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        if (tokenStr) {
            const fetchData = async () => {
                try {
                    const response = await config.getAllCommentsByRoot(id, tokenStr);
                    console.log(response);

                    const dataAuthor = await config.getDetailSong(response?.[0]?.musicId, tokenStr);
                    setComments(response);
                    setAuthor(dataAuthor);
                    console.log(author);
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                    message.error('Không thể tải dữ liệu');
                }
            };
            fetchData();
        }
    }, [id, tokenStr]);

    const handleDeleteComment = async (commentId) => {
        try {
            await config.removeComment(commentId, tokenStr);
            message.success('Xóa bình luận thành công');
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.filter((comment) => comment.id !== commentId),
            }));
        } catch (error) {
            message.error('Không thể xóa bình luận');
        }
    };

    const handleEditComment = async () => {
        try {
            await config.updateComment({ content: newContent }, editingComment.id, tokenStr);
            message.success('Cập nhật bình luận thành công');
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment.id === editingComment.id ? { ...comment, content: newContent } : comment,
                ),
            }));
            setEditingComment(null);
            setNewContent('');
        } catch (error) {
            message.error('Không thể cập nhật bình luận');
        }
    };

    const onBack = () => {
        navigate('/admin/comment');
    };

    return (
        <div className={cx('admin-comment-detail')}>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} className={cx('back-button')} type="primary">
                Quay lại
            </Button>

            {/* Thông tin bài hát */}
            <div className={cx('song-info')}>
                {/* Avatar bài hát */}
                <Image
                    src={author?.avatarResponse?.url}
                    alt="Avatar bài hát"
                    className={cx('song-avatar')}
                    onClick={() => window.open(`/admin/music/detail/${author?.id}`, '_blank')}
                />

                <Title level={3} className={cx('song-title')}>
                    {comments?.[0]?.titleMusic || 'Không rõ tên bài hát'}
                </Title>
                <Text className={cx('song-likes')}>Tác giả: {author?.nickName || 'Không rõ tác giả'}</Text>
                <Divider />
            </div>

            {/* Danh sách bình luận */}
            <div className={cx('comments-section')}>
                <Title level={4} className={cx('comments-title')}>
                    Chi tiết bình luận
                </Title>
                <List
                    className={cx('comment-list')}
                    dataSource={comments || []} // Fallback to an empty array if comments is null
                    renderItem={(comment) => (
                        <List.Item key={comment.id} className={cx('comment-item')}>
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        src={comment?.userResponse?.avatar?.url}
                                        className={cx('avatar-placeholder')}
                                        onClick={() =>
                                            window.open(`/admin/user/detail/${comment?.userResponse?.id}`, '_blank')
                                        }
                                    />
                                }
                                title={
                                    <Text strong className={cx('comment-author')}>
                                        {comment?.userResponse.nickName || 'Không xác định'}
                                    </Text>
                                }
                                description={<Text className={cx('comment-content')}>{comment.content}</Text>}
                            />
                            {/* Di chuyển các nút xuống dưới */}
                            <div className={cx('comment-actions')}>
                                <Button
                                    icon={<EditOutlined />}
                                    type="text"
                                    className={cx('edit-button')}
                                    onClick={() => {
                                        setEditingComment(comment);
                                        setNewContent(comment.content);
                                    }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    type="text"
                                    danger
                                    className={cx('delete-button')}
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            {/* Modal chỉnh sửa bình luận */}
            {editingComment && (
                <Modal
                    title="Chỉnh sửa bình luận"
                    visible={!!editingComment}
                    onOk={handleEditComment}
                    onCancel={() => setEditingComment(null)}
                >
                    <Input.TextArea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} />
                </Modal>
            )}
 
        </div>
    );
};

export default AdminCommentDetail;
