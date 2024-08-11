import * as callPath from '../utils/httpRequest';

const oauth2 = async (code,provider) => {
    try {
        const res = await callPath.post(
            'v1/auth/oauth2',null,{
                params: {
                    code,
                    provider,
                },
            }
        );

        return res.data;
    } catch (err) {
        return {errCode: err.response.status};
    }
};

export default oauth2;
