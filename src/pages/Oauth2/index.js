import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '~/services';
import { UserNotify } from '~/components/Store';

function OAuth2Success() {
    const { setInfoNotify } = UserNotify();
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const { provider } = useParams();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        setId(code);
    }, []);
    useEffect(() => {
        const handleLogin = async (id) => {
            try {
                const data = await config.oauth2(id, provider);

                if (data.errCode) {
                    setInfoNotify({
                        content: 'Đăng nhập thất bại. Hãy thử lại!',
                        delay: 1300,
                        isNotify: true,
                        type: 'error',
                    });
                } else {
                    setInfoNotify({
                        content: 'Đăng nhập thành công',
                        delay: 1300,
                        isNotify: true,
                        type: 'success',
                    });
                    localStorage.setItem('user-id', JSON.stringify(data.result.userResponse));
                    localStorage.setItem('token', JSON.stringify(`Bearer ${data.result.access_token}`));
                    localStorage.setItem('avatar', JSON.stringify(data.result.userResponse.avatar));
                }
            } catch (error) {
                console.error('Login failed', error);
                setInfoNotify({
                    content: 'Đăng nhập thất bại. Hãy thử lại!',
                    delay: 1300,
                    isNotify: true,
                    type: 'error',
                });
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 300);
        };

        if (id) {
            handleLogin(id);
        }
    }, [id, provider, navigate, setInfoNotify]);

    return null;
}

export default OAuth2Success;
