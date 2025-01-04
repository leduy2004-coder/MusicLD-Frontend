import * as callPath from '../utils/httpRequest';

export const getUser = async (id, token) => {
    try {
        const res = await callPath.get('users/get-user', token, {
            params: { id },
        });
        return res;
    } catch (err) {
        return { errCode: err.response.status };
    }
};

export const search = async (q, type = 'less') => {
    try {
        const res = await callPath.get('users/search', null, {
            params: {
                q,
                type,
            },
        });
        return res;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};

export const updateUser = async (token, nickName, gender, dateOfBirth, id) => {
    try {
        const res = await callPath.patch(
            `users/update-user`,
            {
                id,
                nickName,
                dateOfBirth,
                gender,
            },
            token,
        );
        return res.data;
    } catch (err) {
        return { errCode: err.response.status };
    }
};

export const getTopUser = async () => {
    try {
        const res = await callPath.get('users/get-top-user', null, {});
        return res;
    } catch (err) {
        return { errCode: err };
    }
};
