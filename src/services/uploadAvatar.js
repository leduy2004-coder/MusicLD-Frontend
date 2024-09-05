import * as callPath from '../utils/httpRequest';

const uploadAvatar = async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await callPath.post('avatar/upload', formData,token, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};

export default uploadAvatar;