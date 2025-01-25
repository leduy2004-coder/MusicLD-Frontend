import * as callPath from '../utils/httpRequest';

export const verifyAccount = async (email, otp) => {
    try {
        const res = await callPath.post('users/verify-account', null, null, {
            params: {
                email,
                otp,
            },
        });
        console.log(res)
        return res.data;
    } catch (err) {
        return { errorCode: err.response.data.code };
    }
};
export const generateOtp = async (email) => {
    try {
        const res = await callPath.post('users/generate-otp', null, null, {
            params: {
                email,
            },
        });
        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};
