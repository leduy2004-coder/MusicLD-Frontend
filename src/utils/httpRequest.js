import axios from 'axios';

// Tạo instance của Axios
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors
httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;
            try {
                let refreshToken = localStorage.getItem('refresh_token');

                // Kiểm tra nếu refreshToken tồn tại và không phải là null
                if (refreshToken) {
                    refreshToken = JSON.parse(refreshToken); // Đảm bảo đúng định dạng từ localStorage

                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}v1/auth/refresh-token`, null, {
                        headers: {
                            Authorization: refreshToken,
                        },
                    });

                    if (response.status === 200) {
                        const accessToken = response.data.result.access_token;
                        const newRefreshToken = response.data.result.refresh_token;

                        localStorage.setItem('access_token', JSON.stringify(`Bearer ${accessToken}`));
                        localStorage.setItem('refresh_token', JSON.stringify(`Bearer ${newRefreshToken}`));
                        originalRequest.headers.Authorization = JSON.parse(localStorage.getItem('access_token'));

                        return httpRequest(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Error refreshing token', refreshError);
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

// Các phương thức HTTP tương tự như trước
export const get = async (path, tokenStr, options = {}) => {
    const response = await httpRequest.get(path, {
        ...options,
        headers: { ...options.headers, Authorization: tokenStr },
    });
    return response.data;
};

export const post = async (path, data, tokenStr, options = {}) => {
    const response = await httpRequest.post(path, data, {
        ...options,
        headers: { ...options.headers, Authorization: tokenStr },
    });
    return response;
};

export const patch = async (path, data, tokenStr, options = {}) => {
    const response = await httpRequest.patch(path, data, {
        ...options,
        headers: { ...options.headers, Authorization: tokenStr },
    });
    return response;
};

export const deleted = async (path, tokenStr, options = {}) => {
    const response = await httpRequest.delete(path, {
        ...options,
        headers: { ...options.headers, Authorization: tokenStr },
    });
    return response;
};

export default httpRequest;
