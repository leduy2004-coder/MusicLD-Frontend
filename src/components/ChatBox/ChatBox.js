import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatBox.module.scss';
import config from '~/services';
import Image from '../Image';
import images from '~/assets/images';
const cx = classNames.bind(styles);
const ChatBox = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ danh sách tin nhắn
    const [input, setInput] = useState(''); // Trạng thái cho ô nhập liệu
    const [loading, setLoading] = useState(false); // Kiểm tra xem đang tải dữ liệu từ backend hay không
    const messagesEndRef = useRef(null); // Dùng để tham chiếu đến vị trí cuối cùng của tin nhắn

    // Hàm gửi tin nhắn
    const handleSendMessage = async () => {
        if (!input.trim()) return; // Nếu ô nhập liệu trống, không gửi

        // Thêm tin nhắn của người dùng vào danh sách tin nhắn
        setMessages([...messages, { sender: 'user', message: input }]);
        setInput(''); // Xóa nội dung ô nhập liệu
        setLoading(true); // Đặt trạng thái loading

        try {
            // Gửi câu hỏi đến backend
            const response = await config.chat(input);
            console.log(response);
            // Thêm phản hồi của chatbot vào danh sách tin nhắn
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', message: response }]);
        } catch (error) {
            console.error('Có lỗi xảy ra khi gọi API', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
            ]);
        } finally {
            setLoading(false); // Đặt lại trạng thái loading
        }
    };

    // Cuộn đến tin nhắn cuối cùng mỗi khi tin nhắn thay đổi
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={cx('chat-container')}>
            <header className={cx('header')}>
                <Image className={cx('avatar')} src={images.chatBox} />

                <h1>ChatBox MusicLD</h1>
                <span>Thỏa sức sáng tạo với AI</span>
            </header>
            <div className={cx('chat-box')}>
                <div className={cx('messages')}>
                    {/* Hiển thị các tin nhắn */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={cx('message', { user: msg.sender === 'user', bot: msg.sender === 'bot' })}
                        >
                            <span>{msg.message}</span>
                        </div>
                    ))}
                    {loading && <div className={cx('loading')}>...</div>}
                    {/* Hiển thị dấu ba chấm khi đang chờ phản hồi */}
                    <div ref={messagesEndRef}></div> {/* Vị trí để cuộn tới */}
                </div>

                <div className={cx('input-area')}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)} // Cập nhật nội dung ô nhập liệu
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(); // Gửi tin nhắn khi nhấn Enter
                            }
                        }}
                        placeholder="Hỏi tôi bất kỳ điều gì..."
                    />
                    <button onClick={handleSendMessage} disabled={loading}>
                        Gửi
                    </button>
                    {/* Disable nút gửi khi đang tải */}
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
