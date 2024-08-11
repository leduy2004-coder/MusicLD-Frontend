import * as callPath from '~/utils/httpRequest';

export const search = async (q, type = 'less') => {
    try {   
        const res = await callPath.get('users/search', {
            params: {
                q,
                type,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return { errorCode: error.response.status };
    }
};