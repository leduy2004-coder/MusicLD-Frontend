import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import config from '~/services';
import { UserAuth, UserNotify } from '~/components/Store';
import Comment from './Comment';
import styles from './Comment.module.scss';
import CommentForm from './CommentForm';

const cx = classNames.bind(styles);

const Comments = ({ currentMusicId }) => {
    const { tokenStr, userAuth } = UserAuth();
    const { setInfoNotify } = UserNotify();

    const [backendComments, setBackendComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const rootComments = backendComments.filter((backendComment) => backendComment.parentId === null);
    console.log(rootComments);
    const getReplies = (commentId) =>
        backendComments
            .filter((backendComment) => backendComment.parentId === commentId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const addComment = async (text, parentId) => {
        const data = await config.addComment(text, parentId, currentMusicId, tokenStr);
        console.log(data);
        if (data.errorCode) {
            setInfoNotify({
                content: 'Bình luận thất bại. Hãy thử lại !!',
                delay: 1700,
                isNotify: true,
                type: 'error',
            });
        } else {
            setBackendComments([data.result, ...backendComments]);
            setActiveComment(null);
        }
    };

    const updateComment = async (text, commentId) => {
        const data = await config.updateComment(text, commentId, tokenStr);
        if (data.errorCode) {
            setInfoNotify({
                content: 'Cập nhật bình luận thất bại. Hãy thử lại !!',
                delay: 1700,
                isNotify: true,
                type: 'error',
            });
        } else {
            const updatedBackendComments = backendComments.map((backendComment) => {
                if (backendComment.id === commentId) {
                    return { ...backendComment, content: text };
                }
                return backendComment;
            });
            setBackendComments(updatedBackendComments);
            setActiveComment(null);
        }
    };
    const deleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to remove comment?')) {
            const data = await config.removeComment(commentId, tokenStr);
            if (data.errorCode) {
                setInfoNotify({
                    content: 'Xóa thất bại. Hãy thử lại !!',
                    delay: 1700,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                const updatedBackendComments = backendComments.filter(
                    (backendComment) => backendComment.id !== commentId,
                );
                setBackendComments(updatedBackendComments);
            }
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            if (!currentMusicId || !tokenStr) return;

            try {
                const data = await config.getComment(currentMusicId, tokenStr);
                console.log(data);

                if (data.errorCode) {
                    setInfoNotify({
                        content: 'Hiển thị bình luận thất bại. Hãy thử lại !!',
                        delay: 1700,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    setBackendComments(data.result);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
                setInfoNotify({
                    content: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
                    delay: 1700,
                    isNotify: true,
                    type: 'error',
                });
            }
        };

        fetchComments();
    }, [currentMusicId, tokenStr]);

    return (
        <div className={cx('comments')}>
            <div className={cx('comment-form-title')}>Nhập vào đây</div>
            <CommentForm submitLabel="Gửi" handleSubmit={addComment} />
            <div className={cx('comments-container')}>
                {rootComments.map((rootComment) => (
                    <Comment
                        key={rootComment.id}
                        comment={rootComment}
                        replies={getReplies(rootComment.id)}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        addComment={addComment}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
                        currentUserId={userAuth?.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;
