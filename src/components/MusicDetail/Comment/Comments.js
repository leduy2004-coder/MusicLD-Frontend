import { useEffect, useState } from 'react';

import config from '~/services';
import { UserAuth, UserNotify } from '~/components/Store';
import Comment from './Comment';
import CommentForm from './CommentForm';

const Comments = ({currentMusicId }) => {
    const { tokenStr,userAuth, avatar  } = UserAuth();
    const { setInfoNotify } = UserNotify();

    const [backendComments, setBackendComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const rootComments = backendComments.filter((backendComment) => backendComment.parentId === null);
    const getReplies = (commentId) =>
        backendComments
            .filter((backendComment) => backendComment.parentId === commentId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const addComment = async (text, parentId) => {
        const data = await config.addComment(text, parentId, currentMusicId, tokenStr);
        if (data.errorCode) {
            setInfoNotify({
                content: 'Bình luận thất bại. Hãy thử lại !!',
                delay: 1700,
                isNotify: true,
                type: 'error',
            });
        } else {
            setBackendComments([data, ...backendComments]);
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
                    return { ...backendComment, body: text };
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
        const fetchComments = async (currentMusicId,tokenStr) => {
            try {
              console.log(currentMusicId)
                const data = await config.getComment(currentMusicId, tokenStr);
                if (data.errorCode) {
                    setInfoNotify({
                        content: 'Hiển thị bình luận thất bại. Hãy thử lại !!',
                        delay: 1700,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    setBackendComments(data);
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
        <div className="comments">
            <h3 className="comments-title">Bình luận</h3>
            <div className="comment-form-title">Nhập vào đây</div>
            <CommentForm submitLabel="Gửi" handleSubmit={addComment} />
            <div className="comments-container">
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
                        avatarUser ={avatar}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;
