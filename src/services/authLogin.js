import * as callPath from '../utils/httpRequest';

const login = async (username, password) => {
    try {
        const res = await callPath.post('v1/auth/authenticate', {
            username,
            password,
        });

        return res.data;
    } catch (err) {
        return {errCode: err.response.status};
    }
};

export default login;
