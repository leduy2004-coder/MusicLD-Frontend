import * as callPath from '../utils/httpRequest';

const removeAvatar = async (publicId,token) => {
    try {
        const res = await callPath.post(
            `avatar/delete`,
            null,
            {
                headers: {
                    Authorization: token,
                },
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

export default removeAvatar;
