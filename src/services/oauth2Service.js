import * as callPath from '../utils/httpRequest';

const oauth2 = async (code,provider) => {
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

export default oauth2;
