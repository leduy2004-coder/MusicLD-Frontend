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
                    setComments(buildCommentTree(response));
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
    const buildCommentTree = (comments) => {
        const commentMap = {};
        const rootComments = [];

        // Tạo một map để dễ dàng truy xuất bình luận theo ID
        comments.forEach((comment) => {
            commentMap[comment.id] = { ...comment, children: [] };
        });

        // Xây dựng cây bình luận
        comments.forEach((comment) => {
            if (comment.parentId === null) {
                // Là bình luận gốc
                rootComments.push(commentMap[comment.id]);
            } else {
                // Thêm bình luận con vào danh sách `children` của bình luận cha
                const parentComment = commentMap[comment.parentId];
                if (parentComment) {
                    parentComment.children.push(commentMap[comment.id]);
                }
            }
        });

        return rootComments;
    };

    const renderComments = (comments) =>
        comments.map((comment) => (
            <div key={comment.id} className={cx('comment-item')}>
                <List.Item
                    className={cx('comment-item')}
                    onClick={() => window.open(`/admin/user/detail/${comment.userResponse?.id}`, '_blank')}
                >
                    <List.Item.Meta
                        avatar={<Image src={comment.userResponse?.avatar?.url} className={cx('avatar-placeholder')} />}
                        title={
                            <Text strong className={cx('comment-author')}>
                                {comment.userResponse?.nickName || 'Không xác định'}
                            </Text>
                        }
                        description={<Text className={cx('comment-content')}>{comment.content}</Text>}
                    />
                </List.Item>
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
                {/* Hiển thị các bình luận con */}
                {comment.children?.length > 0 && (
                    <div className={cx('comment-children')}>{renderComments(comment.children)}</div>
                )}
            </div>
        ));
    const removeComment = (commentId, comments) => {
        return comments
            .filter((comment) => comment.id !== commentId) // Loại bỏ bình luận có id cần xóa
            .map((comment) => {
                // Nếu bình luận có children, đệ quy để xóa trong children
                if (comment.children && comment.children.length > 0) {
                    comment.children = removeComment(commentId, comment.children);
                }
                return comment;
            });
    };

    const handleDeleteComment = (commentId) => {
        Modal.confirm({
            title: 'Xác nhận xóa bình luận',
            content: 'Bạn có chắc chắn muốn xóa bình luận này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    // Gọi API xóa bình luận
                    await config.removeComment(commentId, tokenStr);

                    // Cập nhật lại cây bình luận sau khi xóa
                    setComments((prevComments) => {
                        const updatedComments = removeComment(commentId, prevComments);

                        // Kiểm tra nếu không còn bình luận nào
                        if (updatedComments.length === 0) {
                            navigate('/admin/comment');
                        }

                        return updatedComments;
                    });

                    message.success('Xóa bình luận thành công');
                } catch (error) {
                    message.error('Không thể xóa bình luận');
                }
            },
        });
    };

    const updateCommentTree = (comments, commentId, newContent) => {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, content: newContent };
            }
            if (comment.children && comment.children.length > 0) {
                return { ...comment, children: updateCommentTree(comment.children, commentId, newContent) };
            }
            return comment;
        });
    };

    const handleEditComment = async () => {
        try {
            await config.updateComment(newContent, editingComment.id, tokenStr);
            message.success('Cập nhật bình luận thành công');

            // Cập nhật nội dung bình luận trong cây
            setComments((prevComments) => updateCommentTree(prevComments, editingComment.id, newContent));
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
                <List className={cx('comment-list')}>{comments && renderComments(comments)}</List>
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
