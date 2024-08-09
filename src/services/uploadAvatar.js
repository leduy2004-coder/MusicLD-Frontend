import * as callPath from '../utils/httpRequest';

const uploadAvatar = async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await callPath.post('avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
            },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};

export default uploadAvatar;
