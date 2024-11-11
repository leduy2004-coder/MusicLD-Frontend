import * as callPath from '../utils/httpRequest';

export const getVNPay = async (amount, bankCode, token) => {
    try {
        const res = await callPath.get(`payment/vn-pay?amount=${amount}&bankCode=${bankCode}`, token, {});
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};
