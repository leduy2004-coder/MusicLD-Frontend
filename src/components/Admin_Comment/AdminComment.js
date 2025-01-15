import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { UserAuth } from '../Store';
import config from '~/services';
import moment from 'moment';
import Image from '../Image';

const AdminComment = () => {
    const [comments, setComments] = useState([]);
    const [userSearchText, setUserSearchText] = useState('');
    const [songSearchText, setSongSearchText] = useState('');
    const [filteredComments, setFilteredComments] = useState([]);
    const { tokenStr } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await config.getAllComments(tokenStr);
                setComments(data);
                setFilteredComments(data);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu bình luận.');
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [tokenStr]);

    useEffect(() => {
        // Lọc theo người bình luận và tên bài hát
        setFilteredComments(
            comments.filter(
                (comment) =>
                    (userSearchText
                        ? comment.userResponse.nickName.toLowerCase().includes(userSearchText.toLowerCase())
                        : true) &&
                    (songSearchText ? comment.titleMusic.toLowerCase().includes(songSearchText.toLowerCase()) : true),
            ),
        );
    }, [userSearchText, songSearchText, comments]);

    const handleRowClick = (record) => {
        navigate(`/admin/comment/detail/${record.id}`);
    };

    const columns = [
        {
            title: 'Bài hát',
            dataIndex: 'titleMusic',
            key: 'titleMusic',
            render: (text, record) => {
                const { id } = record;
                return (
                    <a
                        href={`/admin/music/detail/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {text}
                    </a>
                );
            },
        },
        {
            title: 'Người bình luận',
            dataIndex: 'userResponse',
            key: 'userResponse',
            render: (userResponse) => {
                const { nickName, avatar, id } = userResponse;
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            src={avatar?.url}
                            alt={nickName}
                            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
                        />
                        <a
                            href={`/admin/user/detail/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {nickName}
                        </a>
                    </div>
                );
            },
        },
        {
            title: 'Bình luận',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                const color = text === 'approved' ? 'green' : 'red';
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm theo người bình luận"
                    value={userSearchText}
                    onChange={(e) => setUserSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: 250, marginRight: 8 }}
                />
                <Input
                    placeholder="Tìm kiếm theo bài hát"
                    value={songSearchText}
                    onChange={(e) => setSongSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                />
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredComments}
                pagination={{ pageSize: 10 }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' },
                })}
            />
        </div>
    );
};

export default AdminComment;
