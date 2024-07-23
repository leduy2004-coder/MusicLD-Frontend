import * as callPath from '../utils/httpRequest';

const register = async (username, password, fullName, dateOfBirth, code) => {
    try {
        const res = await callPath.post('users/register', {
            username,
            password,
            fullName,
            dateOfBirth,
            authType: 'LOCAL', 
            roles: [{ code: code }], 
        });
        
        return res.data;
    } catch (err) {
        console.error('Error during registration:', err);
        return { errCode: err.response.status }; 
    }
};

export default register;