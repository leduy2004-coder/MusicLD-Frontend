import * as callPath from '../utils/httpRequest';

export const updateRequestFollowUser = async (id, token, status) => {
    try {
        const res = await callPath.patch(`follow/${id}/${status}`, null, {
            headers: {
                Authorization: token,
            },
        });
        return res.data;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllFollower = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-follower/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllFollowing = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-following/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllRequest = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-request/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllReceive= async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-receive/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};
