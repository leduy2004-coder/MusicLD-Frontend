import * as callPath from '../utils/httpRequest';

export const uploadAvatar = async (file, token) => {
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

export const getAvatar = async (avatar) => {
    try {
        const res = await callPath.get(
            `avatar/${avatar}`,
            {},
            {
                responseType: 'arraybuffer'
            }
        );
        const base64Image = btoa(
            new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        );
        return base64Image
    } catch (err) {
        return { errorCode: err.response.status };
    }
};

export const removeAvatar = async (publicId,token) => {
    try {
        const res = await callPath.post(
            `avatar/delete`,
            null,
            token,
            {
                params: {
                    publicId
                },
            }
        );

        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};
