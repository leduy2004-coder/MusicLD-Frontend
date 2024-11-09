import * as callPath from '../utils/httpRequest';

export const getComment = async (id, token) => {
    try {
        console.log(id)
        const res = await callPath.get('comment/get-all-by-music', token, {
            params: { id },
        });
        return res;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};

export const removeComment = async (id, token) => {
    try {
        const res = await callPath.deleted(`comment/delete`, token, {
            params: {
                id,
            },
        });

        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};

export const addComment = async (content, parentId, musicId, token) => {
    try {
        const res = await callPath.post('comment/insert', { content, parentId, musicId }, token);
        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};

export const updateComment = async (content, id, token) => {
    try {
        const res = await callPath.patch(`comment/update`, { content, id }, token, {});
        return res.data;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
