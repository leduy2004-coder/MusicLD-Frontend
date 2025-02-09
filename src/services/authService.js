import * as callPath from '../utils/httpRequest';

export const login = async (username, password) => {
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


export const register = async (email,username, password, nickName, dateOfBirth,gender, code) => {
    try {
        const res = await callPath.post('users/register', {
            
        });
        return res.data;
    } catch (err) {
        console.log(err);
        return { errCode: err.response.status }; 
    }
};


export const logout = async (token) => {
    try {
        const res = await callPath.post(
            'auth/logout',{},token
        );
        return res;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};

export const oauth2 = async (code,provider) => {
    try {
        const res = await callPath.post(
            'v1/auth/oauth2',null,null,{
                params: {
                    code,
                    provider,
                },
            }
        );
        return res.data;
    } catch (err) {
        return {error: err.response};
    }
};