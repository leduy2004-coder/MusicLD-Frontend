import * as callPath from '../utils/httpRequest';

const register = async (username, password, nickName, dateOfBirth, code) => {
    try {
        const res = await callPath.post('users/register', {
            username,
            password,
            nickName,
            dateOfBirth,
            authType: 'LOCAL', 
            roles: [{ code: code }], 
        });
        return res.data;
    } catch (err) {
        console.log(err);
        return { errCode: err.response.status }; 
    }
};

export default register;