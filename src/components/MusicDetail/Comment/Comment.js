import Image from '~/components/Image';
import CommentForm from './CommentForm';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import styles from './Comment.module.scss';

const cx = classNames.bind(styles);
const Comment = ({
    comment,
    replies,
    setActiveComment,
    activeComment,
    updateComment,
    deleteComment,
    addComment,
    parentId = null,
    currentUserId,
}) => {
    const isEditing = activeComment && activeComment.id === comment.id && activeComment.type === 'editing';
    const isReplying = activeComment && activeComment.id === comment.id && activeComment.type === 'replying';
    const fiveMinutes = 3000000;
    const timePassed = new Date() - new Date(comment.createdDate) > fiveMinutes;
    const canDelete = currentUserId === comment.userResponse.id && replies.length === 0 && !timePassed;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.userResponse.id && !timePassed;
    const replyId = parentId ? parentId : comment.id;
    const createdAt = new Date(comment.createdDate).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false, // Để đảm bảo sử dụng định dạng 24 giờ
    });
    const navigate = useNavigate();

    const handleUser = () => {
        navigate(`/profile/${comment.userResponse.id}`);
    };
    return (
        <div key={comment.id} className={cx('comment')}>
            <div className={cx('comment-image-container')}>
                <Image src={comment?.userResponse?.avatar.url} className={cx('img-avatar')} onClick={handleUser} />
            </div>
            <div className={cx('comment-right-part')}>
                <div className={cx('comment-root')}>
                    <div className={cx('comment-content')}>
                        <div className={cx('comment-author')}>{comment.userResponse.nickName}</div>
                        <div className={cx('comment-time')}>{createdAt}</div>
                    </div>
                    {!isEditing && <div className={cx('comment-text')}>{comment.content}</div>}
                    {isEditing && (
                        <CommentForm
                            submitLabel="Sửa"
                            hasCancelButton
                            initialText={comment.content}
                            handleSubmit={(text) => updateComment(text, comment.id)}
                            handleCancel={() => {
                                setActiveComment(null);
                            }}
                        />
                    )}
                    <div className={cx('comment-actions')}>
                        {canReply && (
                            <div
                                className={cx('comment-action')}
                                onClick={() => setActiveComment({ id: comment.id, type: 'replying' })}
                                title="Phản hồi"
                            >
                                <CommentOutlined />
                            </div>
                        )}
                        {canEdit && (
                            <div
                                className={cx('comment-action')}
                                onClick={() => setActiveComment({ id: comment.id, type: 'editing' })}
                                title="Sửa"
                            >
                                <EditOutlined />
                            </div>
                        )}
                        {canDelete && (
                            <div className={cx('comment-action')} onClick={() => deleteComment(comment.id)} title='Xóa'>
                                <DeleteOutlined />
                            </div>
                        )}
                    </div>
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Gửi"
                        handleSubmit={(text) => addComment(text, replyId)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                {replies.length > 0 && (
                    <div className={cx('replies')}>
                        {replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply.id}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                parentId={comment.id}
                                replies={[]}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
