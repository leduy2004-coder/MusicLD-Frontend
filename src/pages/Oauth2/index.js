import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/services';
import { UserNotify } from '~/components/Store';

function OAuth2Success() {
    const { setInfoNotify } = UserNotify();
    const navigate = useNavigate();
    const [id, setId] = useState(null);

    useEffect(() => {
        const handleOAuth2Callback = () => {
            const pathname = window.location.pathname;
            if (pathname.includes('/oauth2/callback')) {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('id');
                setId(code);
            }
        };

        handleOAuth2Callback();
    }, []);

    useEffect(() => {
        const handleLogin = async (id) => {
            try {
                const data = await config.oauth2(id);
                if (data.errCode) {
                    setInfoNotify({
                        content: 'Đăng nhập thất bại. Hãy thử lại!',
                        delay: 1500,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    setInfoNotify({
                        content: 'Đăng nhập thành công',
                        delay: 1500,
                        isNotify: true,
                        type: 'success',
                    });
                    localStorage.setItem('user-id', JSON.stringify(data.result.userResponse));
                    localStorage.setItem('token', JSON.stringify(`Bearer ${data.result.access_token}`));
                }
            } catch (error) {
                console.error('Login failed', error);
                setInfoNotify({
                    content: 'Đăng nhập thất bại. Hãy thử lại!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            } 

            setTimeout(() => {
                window.location.href = '/';
            }, 500); 
        };

        if (id) {
            handleLogin(id);
        }
    }, [id, navigate, setInfoNotify]);

    return null;
}

export default OAuth2Success;
