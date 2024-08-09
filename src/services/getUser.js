import * as callPath from '../utils/httpRequest';

const getUser = async (id,token) => {
    try {
        const res = await callPath.post(
            'users/get-user',
            {id},
            {
                headers: {
                    Authorization: token,
                },
            },
        );

        return res.data;
    } catch (err) {
        return {errCode: err.response.status};
    }
};

export default getUser;
