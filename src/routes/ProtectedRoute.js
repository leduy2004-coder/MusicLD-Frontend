import { useEffect } from 'react';
import { UserAuth, UserNotify } from '~/components/Store';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole, setShowPlayMusic }) {
    const { tokenStr, userAuth } = UserAuth();
    const { setInfoNotify } = UserNotify();
    const navigate = useNavigate();

    useEffect(() => {
        // Sử dụng setTimeout để trì hoãn việc kiểm tra token
        const timeoutId = setTimeout(() => {
            if (!tokenStr) {
                setInfoNotify({
                    content: 'Vui lòng đăng nhập !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
                navigate(`/login`);
            }
            if (requiredRole && userAuth?.roles?.code !== requiredRole) {
                setInfoNotify({
                    content: 'Bạn không có quyền. Vui lòng đăng nhập',
                    delay: 2000,
                    isNotify: true,
                    type: 'error',
                });
            }
            return;
        }, 300);

        if (requiredRole === 'ADMIN') {
            setShowPlayMusic(false);
        }
        // Dọn dẹp timeout nếu component bị unmount
        return () => clearTimeout(timeoutId);
    }, [tokenStr, requiredRole, setInfoNotify, setShowPlayMusic]);

    return children;
}

export default ProtectedRoute;
