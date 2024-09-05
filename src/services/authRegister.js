import * as callPath from '../utils/httpRequest';

const register = async (username, password, nickName, dateOfBirth,gender, code) => {
    try {
        const res = await callPath.post('users/register', {
            username,
            password,
            nickName,
            dateOfBirth,
            gender,
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