import React, { useEffect, useState, useCallback, useRef } from 'react';
import { UserAuth } from '../Store';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import styles from './ChatRoom.module.scss';
import Image from '../Image';
const cx = classNames.bind(styles);
let stompClient = null;

const ChatRoom = () => {
    const { userAuth, setOpenMessage, tokenStr, avatar } = UserAuth();
    const navigate = useNavigate();

    const [publicChats, setPublicChats] = useState(() => {
        const savedChats = localStorage.getItem('publicChats');
        return savedChats ? JSON.parse(savedChats) : [];
    });
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData
            ? JSON.parse(savedUserData)
            : {
                  id: userAuth.id,
                  username: userAuth?.nickName || '',
                  avatar: avatar,
                  connected: false,
                  message: '',
              };
    });

    const chatContentRef = useRef(null);
    const isSending = useRef(false);

    const connect = useCallback(() => {
        console.log('connect');
        let Sock = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`);
        stompClient = over(Sock);
        const connectHeaders = {
            Authorization: tokenStr,
        };

        stompClient.connect(connectHeaders, onConnected, onError);
    }, [tokenStr]);

    const isConnected = useRef(false);

    useEffect(() => {
        if (userAuth?.nickName && !isConnected.current) {
            setUserData((prevState) => ({
                ...prevState,
                username: userAuth.nickName,
            }));
            connect();
            isConnected.current = true;
        }
    }, [userAuth, connect]);

    useEffect(() => {
        localStorage.setItem('publicChats', JSON.stringify(publicChats));
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [publicChats, userData]);

    // Scroll to the bottom when a new message arrives or the chat is opened
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [publicChats]);

    const onConnected = () => {
        setUserData((prevState) => ({ ...prevState, connected: true }));
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        userJoin();
    };

    const userJoin = () => {
        const chatMessage = {
            senderName: userData.username,
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };
    const userLeave = () => {
        const chatMessage = {
            senderName: userData.username,
            status: 'LEAVE',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };
    const onMessageReceived = (message) => {
        const payloadData = JSON.parse(message.body);
        if (payloadData.status === 'JOIN') {
            setPublicChats((prevChats) => [
                ...prevChats,
                {
                    senderName: 'System',
                    message: `${payloadData.senderName} đã tham gia`,
                    status: 'JOIN',
                },
            ]);
        } else if (payloadData.status === 'MESSAGE') {
            setPublicChats((prevChats) => [...prevChats, payloadData]);
        } else if (payloadData.status === 'LEAVE') {
            setPublicChats((prevChats) => [
                ...prevChats,
                {
                    senderName: 'System',
                    message: `${payloadData.senderName} đã rời phòng`,
                    status: 'LEAVE',
                },
            ]);
        }
    };

    const onError = (err) => {
        console.error('STOMP Error:', err);
    };

    const handleMessage = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            message: event.target.value,
        }));
    };

    const sendValue = () => {
        console.log('send');

        if (stompClient && userData.message && !isSending.current) {
            isSending.current = true;
            const chatMessage = {
                id: userData.id,
                senderName: userData.username,
                avatar: userData.avatar.url,
                message: userData.message,
                status: 'MESSAGE',
            };
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            setUserData((prevState) => ({
                ...prevState,
                message: '',
            }));

            setTimeout(() => {
                isSending.current = false;
            }, 500);
        }
    };

    const handleClose = () => {
        userLeave();
        setTimeout(() => {
            setUserData((prevData) => ({
                ...prevData,
                connected: false,
            }));
            setOpenMessage(false);
        }, 10);
    };
    const handleUser = (id) => {
        navigate(`/profile/${id}`);
    };

    return (
        <div className={cx('container')}>
            {userData.connected ? (
                <div className={cx('chat-box')}>
                    <div className={cx('chat-header')}>
                        <span>Chat cộng đồng</span>

                        <button className={cx('close-button')} onClick={handleClose}>
                            ×
                        </button>
                    </div>
                    <div className={cx('chat-content')} ref={chatContentRef}>
                        <ul className={cx('chat-messages')}>
                            {publicChats.map((chat, index) => (
                                <li
                                    className={cx('message', { self: chat.senderName === userData.username })}
                                    key={index}
                                >
                                    {chat.status === 'JOIN' ? (
                                        <div className={cx('system-message')}>{chat.message}</div>
                                    ) : chat.status === 'LEAVE' ? (
                                        <div className={cx('system-message')}>{chat.message}</div>
                                    ) : (
                                        <>
                                            {chat.senderName !== userData.username && (
                                                <div
                                                    className={cx('user-other')}
                                                    onClick={() => handleUser(userData.id)}
                                                >
                                                    <Image
                                                        className={cx('avatar')}
                                                        src={avatar.url}
                                                        alt="User Avatar"
                                                    />
                                                    <div className={cx('name-other')}>{chat.senderName}</div>
                                                </div>
                                            )}
                                            <div className={cx('message-data')}>{chat.message}</div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className={cx('send-message')}>
                            <input
                                type="text"
                                className={cx('input-message')}
                                placeholder="Nhập tin nhắn"
                                value={userData.message}
                                onChange={handleMessage}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendValue();
                                    }
                                }}
                            />
                            <button type="button" className={cx('send-button')} onClick={sendValue}>
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cx('connect-message')}>Vui lòng kết nối</div>
            )}
        </div>
    );
};

export default ChatRoom;
