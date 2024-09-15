import axios from 'axios';

// Tạo instance của Axios
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor logic here...
httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/v1/auth/refresh-token`, null, {
                        headers: {
                            Authorization: refreshToken,
                        },
                    });

                    if (response.status === 200) {
                        const { access_token, refresh_token } = response.data.result;
                        localStorage.setItem('access_token', JSON.stringify(`Bearer ${access_token}`));
                        localStorage.setItem('refresh_token', JSON.stringify(`Bearer ${refresh_token}`));

                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                        processQueue(null, access_token);
                        return httpRequest(originalRequest);
                    }
                } catch (error) {
                    processQueue(error, null);
                    localStorage.clear();
                    window.location.href = '/login';
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return httpRequest(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
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
