import * as callPath from '../utils/httpRequest';

const getUser = async (id, token) => {
    try {
        const res = await callPath.get('users/get-user', {
            params: { id },

            headers: {
                Authorization: token,
            },
        });
        return res;
    } catch (err) {
        return { errCode: err.response.status };
    }
};

export default getUser;
