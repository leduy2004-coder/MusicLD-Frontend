import * as callPath from '../utils/httpRequest';

const getAvatar = async (avatar) => {
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

export default getAvatar;
