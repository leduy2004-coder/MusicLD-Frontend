import * as callPath from '../utils/httpRequest';

export const getAllMusic = async (token) => {
    try {
        const res = await callPath.get('music/get-all', token, {});
        return res.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const getDetailSong = async (id, token) => {
    try {
        const res = await callPath.get('music/get-music', token, {
            params: { id },
        });
        return res.result;
    } catch (errorCode) {
        return { errorCode: errorCode.response.status };
    }
};
export const getPlaylist = async (id, token) => {
    try {
        const res = await callPath.get('music/get-playlist', token, {
            params: { id },
        });
        return res.result;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};
export const getCountMusic = async (userId, token) => {
    try {
        const res = await callPath.get('music/get-count', token, {
            params: { userId },
        });
        return res.result;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};
export const getPlaylistByAccess = async (id, token, access) => {
    try {
        const res = await callPath.get('music/get-playlist-access', token, {
            params: { id, access },
        });
        return res;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};
export const uploadMusic = async (formData, token) => {
    try {
        const res = await callPath.post('music/upload', formData, token, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};
export const uploadMusicOfAdmin = async (formData, token) => {
    try {
        const res = await callPath.post('music/upload-of-admin', formData, token, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};
export const removeMusic = async (id, token) => {
    try {
        const res = await callPath.deleted('music/delete-music', token, {
            params: { id },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};
export const updateStatusMusic = async (id, token) => {
    try {
        const res = await callPath.post('music/update-status', { id }, token);
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};

export const updateMusic = async (formData, token) => {
    try {
        const res = await callPath.patch(`music/update-music`, formData, token, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const updateMusicOfAdmin = async (formData, token) => {
    try {
        const res = await callPath.patch(`music/update-music-of-admin`, formData, token, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.result;
    } catch (err) {
        return { errCode: err.response.status };
    }
};
export const likeMusic = async (userId, musicId, token) => {
    try {
        const res = await callPath.post('music/like', null, token, {
            params: { userId, musicId },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};
export const unLikeMusic = async (userId, musicId, token) => {
    try {
        const res = await callPath.post('music/un-like', null, token, {
            params: { userId, musicId },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};

export const getTopMusic = async () => {
    try {
        const res = await callPath.get('music/get-top-music', null, {});
        return res;
    } catch (err) {
        return { errCode: err };
    }
};
