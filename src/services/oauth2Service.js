import * as callPath from '../utils/httpRequest';

const oauth2 = async (id) => {
    try {
        const res = await callPath.post(
            'v1/auth/oauth2',
            {id},
        );

        return res.data;
    } catch (err) {
        return {errCode: err.response.status};
    }
};

export default oauth2;
