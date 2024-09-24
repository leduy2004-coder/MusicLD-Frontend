import * as callPath from '../utils/httpRequest';

export const updateRequestFollowUser = async (id, token, status) => {
    try {

        const res = await callPath.patch(`follow/${id}/${status}`, null,token);
        return res.data;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllFollower = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-follower/${id}`,token);
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllFollowing = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-following/${id}`,token);
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllRequest = async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-request/${id}`,token);
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const getAllReceive= async (id, token) => {
    try {
        const res = await callPath.get(`follow/get-all-receive/${id}`,token);
        return res.result;
    } catch (error) {
        return { Error: error.response };
    }
};

export const checkFollow = async (id,token) => {
    try {
        const res = await callPath.post(
            `follow/check-follow/${id}`,
            null,
            token,
        );

        return res.data;
    } catch (err) {
        return { errorCode: err.response.status };
    }
};
