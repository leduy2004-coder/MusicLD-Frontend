import * as callPath from '../utils/httpRequest';

export const addUser = async (username, password, nickName, dateOfBirth, gender, code, token) => {
    try {
        const res = await callPath.post(
            'users/add-user',
            {
                username,
                password,
                nickName,
                dateOfBirth,
                gender,
                authType: 'LOCAL',
                roles: [{ code: code }],
            },
            token,
        );
        return res.data.result;
    } catch (err) {
        console.log(err);
        return { errCode: err.response.status };
    }
};

export const getUser = async (id, token) => {
    try {
        const res = await callPath.get('users/get-user', token, {
            params: { id },
        });
        return res.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const getUserForAdmin = async (id, token) => {
    try {
        const res = await callPath.get('users/get-user-for-admin', token, {
            params: { id },
        });
        return res.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const getAllUser = async (token) => {
    try {
        const res = await callPath.get('users/get-all', token, {});
        return res.result;
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

export const updateUser = async (token, username, password, nickName, gender, dateOfBirth, status, id) => {
    try {
        const res = await callPath.patch(
            `users/update-user`,
            {
                id,
                username,
                password,
                nickName,
                dateOfBirth,
                gender,
                status,
            },
            token,
        );
        return res.data.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const changePassword = async (token, currentPassword, newPassword, confirmationPassword) => {
    try {
        const res = await callPath.patch(
            `users/change-password`,
            {
                currentPassword,
                newPassword,
                confirmationPassword
            },
            token,
        );
        return res.data.result;
    } catch (err) {
        return { errCode: err.response.data.code };
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

export const deleteUser = async (id, token) => {
    try {
        const res = await callPath.deleted('users/delete-user', token, {
            params: { id },
        });
        return res.data;
    } catch (err) {
        return { errCode: err.response?.status || 500, message: err.message };
    }
};

