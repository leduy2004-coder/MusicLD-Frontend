import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind'; // Để bind SCSS module vào
import { Button, Nav, NavItem } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '~/components/Icons';
import bgAdmin from '~/assets/images/bgAdmin.jpg';
import { UserNotify } from '~/components/Store';
import { UserAuth } from '~/components/Store';
import styles from './AdminSidebar.module.scss'; // Import SCSS module
import Image from '~/components/Image';
const cx = classNames.bind(styles); // Sử dụng bind để áp dụng các lớp từ SCSS module

const navigation = [
    {
        title: 'Thống kê',
        href: '/admin/statistic',
        icon: 'bi bi-bar-chart-line', 
    },
    {
        title: 'Quản lí tài khoản',
        href: '/admin/user',
        icon: 'bi bi-person-circle', 
    },
    {
        title: 'Quản lí nhạc',
        href: '/admin/music',
        icon: 'bi bi-music-note', 
    },
    {
        title: 'Thông tin',
        href: '/admin/about',
        icon: 'bi bi-info-circle', 
    },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const showMobilemenu = () => {
        document.getElementById('sidebarArea').classList.toggle('showSidebar');
    };
    let location = useLocation();
    const { setInfoNotify } = UserNotify();
    const { userAuth, tokenStr, avatar } = UserAuth();

    // useEffect(() => {
    //     if (tokenStr) {
    //         const fetchProfile = async () => {
    //             try {
    //                 const data = await config.getUser(id, tokenStr);
    //                 setProfileAdmin(data.result);
    //             } catch (error) {
    //                 console.error('Failed to fetch profile:', error);
    //             }
    //         };
    //         fetchProfile();
    //     }
    // }, [tokenStr]);

    const handleLogout = () => {
        setInfoNotify({
            content: 'Đăng xuất thành công !!',
            delay: 1300,
            isNotify: true,
            type: 'success',
        });
        setTimeout(() => {
            localStorage.clear();
            navigate(`/login`);
            window.location.reload();
        }, [300]);
    };

    return (
        <div>
            <div className="d-flex align-items-center"></div>
            <div className={cx('profilebg')} style={{ background: `url(${bgAdmin}) no-repeat` }}>
                <div className="p-3 d-flex">
                    <Image src={avatar.url} className={cx('rounded-circle')} />
                    <Button color="white" className="ms-auto text-white d-lg-none" onClick={() => showMobilemenu()}>
                        <i className="bi bi-x"></i>
                    </Button>
                </div>
                <div className="bg-dark text-white p-2 opacity-75">{userAuth.nickName}</div>
            </div>
            <div className="p-3 mt-2">
                <Nav vertical className={cx('sidebarNav')}>
                    {navigation.map((navi, index) => (
                        <NavItem key={index} className={cx('sidenav-bg')}>
                            <Link
                                to={navi.href}
                                className={
                                    location.pathname === navi.href
                                        ? `${cx('active')} nav-link py-3`
                                        : `${cx('nav-link')} ${cx('text-secondary')} py-3`
                                }
                            >
                                <i className={navi.icon}></i>
                                <span className="ms-3 d-inline-block">{navi.title}</span>
                            </Link>
                        </NavItem>
                    ))}
                    <Button
                        color="danger"
                        tag="a"
                        target="_blank"
                        className="mt-3"
                        onClick={handleLogout}
                        style={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            height: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0 20px', // Để có khoảng cách giữa các cạnh trái và phải
                        }}
                    >
                        Đăng xuất
                    </Button>
                </Nav>
            </div>
        </div>
    );
};

export default AdminSidebar;
