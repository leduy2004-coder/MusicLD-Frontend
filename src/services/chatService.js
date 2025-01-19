import * as callPath from '../utils/httpRequest';

export const chat = async (question) => {
    try {
        const res = await callPath.post('chat-box/ask', {
            question,
        });
        console.log(res)
        return res.data.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
