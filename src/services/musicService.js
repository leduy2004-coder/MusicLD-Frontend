import axios from 'axios';
import * as callPath from '../utils/httpRequest';

export const getSong = (sid) =>
    new Promise(async (resolve, reject) => {
        try {
            const respon = await axios({
                url: '/song',
                method: 'get',
                params: { id: sid },
            });
            resolve(respon);
        } catch (error) {
            reject(error);
        }
    });
export const getDetailSong = (sid) =>
    new Promise(async (resolve, reject) => {
        try {
            const respon = await axios({
                url: '/infosong',
                method: 'get',
                params: { id: sid },
            });
            resolve(respon);
        } catch (error) {
            reject(error);
        }
    });
export const getPlaylist = async (id, token) => {
    try {
        const res = await callPath.get('music/get-playlist', token, {
            params: { id },
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

export const removeMusic = async (publicIdMusic, publicIdAvatar, id, token) => {
    try {
        const res = await callPath.post('music/delete', { publicIdMusic, publicIdAvatar, id }, token);
        return res.data;
    } catch (error) {
        return { errorCode: error.response };
    }
};
