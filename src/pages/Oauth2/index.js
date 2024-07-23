import { useEffect, useState } from 'react';
import config from '~/services';
import { UserNotify } from '~/components/Store';

function OAuth2Success() {
    const { setInfoNotify } = UserNotify();
    const [id, setId] = useState(null);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('/oauth2/callback')) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('id');
            setId(code);
        }
    }, []);

    useEffect(() => {
        if (id) {
            handleLogin(id); 
        }
    }, [id]);

    const handleLogin = async (id) => {
        try {
            const data = await config.getUser(id);
            if (data.errCode) {
                setInfoNotify({
                    content: 'Đăng nhập thất bại. Hãy thử lại !!',
                    delay: 1500,
                    isNotify: true,
                });
            } else {
                setInfoNotify({
                    content: 'Đăng nhập thành công',
                    delay: 1500,
                    isNotify: true,
                });
                localStorage.setItem('user-id', JSON.stringify(data.result.userResponse));
                localStorage.setItem('token', JSON.stringify(`Bearer ${data.result.access_token}`));
            }
        } catch (error) {
            console.error('Login failed', error);
            setInfoNotify({
                content: 'Đăng nhập thất bại. Hãy thử lại !!',
                delay: 1500,
                isNotify: true,
            });
        }
        setTimeout(() => {
            window.location.href = '/';
        }, 300); 
    };

    return null; 
}

export default OAuth2Success;
