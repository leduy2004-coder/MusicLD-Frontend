import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse, Navbar } from 'reactstrap';
import styles from './HeaderAdmin.module.scss'; // Import SCSS Module
import classNames from 'classnames/bind'; // Import classNames

const cx = classNames.bind(styles); // Bind the styles

const AdminHeader = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const HandleToggle = () => {
        setIsOpen(!isOpen);
    };

    const showMobileMenu = () => {
        document.getElementById('sidebarArea').classList.toggle('showSidebar');
    };

    return (
        <Navbar color="dark" dark expand="md" className={cx('fix-header')}>
            <div className="d-flex align-items-center">
                <div className="d-lg-block d-none me-5 pe-3">
                    <Link to="/admin/statistic" className="nav-link">
                        <div className={cx('logo')}>MUSICLD</div>
                    </Link>
                </div>

                <Button 
                    color="primary" 
                    className={cx('mobile-button', 'd-lg-none')} 
                    onClick={showMobileMenu}
                >
                    <i className="bi bi-list"></i>
                </Button>
            </div>
            <div className="hstack gap-2">
                <Button 
                    color="primary" 
                    size="sm" 
                    className="d-sm-block d-md-none" 
                    onClick={HandleToggle}
                >
                    {isOpen ? <i className="bi bi-x"></i> : <i className="bi bi-three-dots-vertical"></i>}
                </Button>
            </div>

            <div className={cx('header-title')}>Trang quản trị viên</div>
            
            <Collapse navbar isOpen={isOpen}>
                {/* Add any collapsing elements here if needed */}
            </Collapse>
        </Navbar>
    );
};

export default AdminHeader;
