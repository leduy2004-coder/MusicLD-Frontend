import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';
import classNames from 'classnames/bind';
import styles from './Switch.module.scss';

const cx = classNames.bind(styles);
const ThemeSwitcher = () => {
    // Kiểm tra trạng thái chủ đề trong localStorage, mặc định là 'light'
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Thiết lập thuộc tính data-theme cho thẻ html
        document.documentElement.setAttribute('data-theme', theme);
        // Lưu trạng thái chủ đề vào localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (checked) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <div style={{ margin: '20px' }}>
            <span style={{ marginRight: '8px' }}>Sáng</span>
            <Switch onChange={toggleTheme} checked={theme === 'dark'} className={styles.customSwitch} />
            <span style={{ marginLeft: '8px' }}>Tối</span>
        </div>
    );
};

export default ThemeSwitcher;
