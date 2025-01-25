import * as callPath from '../utils/httpRequest';

export const verifyAccount = async (email, otp, type) => {
    try {
        const res = await callPath.post('users/verify-account', null, null, {
            params: {
                email,
                otp,
                type,
            },
        });
        return res.data;
    } catch (err) {
        return { errorCode: err.response.data.code };
    }
};
export const generateOtp = async (email, type) => {
    try {
        const res = await callPath.post('users/generate-otp', null, null, {
            params: {
                email,
                type,
            },
        });
        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};
