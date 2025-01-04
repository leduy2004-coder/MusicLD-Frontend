import React from 'react';
import AdminSidebar from '../components/Admin_Sidebar';
import AdminHeader from '../components/Admin_Header';
import { Container } from 'reactstrap';
import Notify from '~/components/Notify';
import styles from './AdminDefaultLayout.module.scss';
import classNames from 'classnames/bind';

// Bind styles to cx
const cx = classNames.bind(styles);

function AdminDefaultLayout({ children }) {
    return (
        <div className={cx('font')}>
            <AdminHeader />
            <div className={cx('pageWrapper', 'd-lg-flex')}>
                <aside className={cx('sidebarArea', 'shadow')} id="sidebarArea">
                    <AdminSidebar />
                </aside>
                <div className={cx('contentArea')}>
                    <Container className="p-4" fluid>
                        {children}
                    </Container>
                </div>
            </div>
            <div className={cx('admin-notify')}>
                <Notify />
            </div>
        </div>
    );
}

export default AdminDefaultLayout;
