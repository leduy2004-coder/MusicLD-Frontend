import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Comment.module.scss';

const cx = classNames.bind(styles);
const CommentForm = ({ handleSubmit, submitLabel, hasCancelButton = false, handleCancel, initialText = '' }) => {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    const onSubmit = (event) => {
        event.preventDefault();
        handleSubmit(text);
        setText('');
    };
    const onCancel = () => {
        setText('');
        if (handleCancel) {
            handleCancel();
        }
    };
    return (
        <form onSubmit={onSubmit}>
            <textarea className={cx('comment-form-textarea')} value={text} onChange={(e) => setText(e.target.value)} />
            <div className={cx('button-area')}>
                <button className={cx('comment-form-button')} disabled={isTextareaDisabled}>
                    {submitLabel}
                </button>
                <button
                    type="button"
                    className={cx('comment-form-cancel-button')}
                    onClick={onCancel}
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
