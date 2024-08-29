import axios from "axios";
import * as callPath from '../utils/httpRequest';

export const getSong = (sid) => new Promise(async(resolve, reject) => {
    try {
        const respon = await axios({
            url: '/song',
            method : 'get',
            params :{id: sid}
        })
        resolve(respon);
    } catch (error) {
        reject(error);
    }
});
export const getDetailSong = (sid) => new Promise(async(resolve, reject) => {
    try {
        const respon = await axios({
            url: '/infosong',
            method : 'get',
            params :{id: sid}
        })
        resolve(respon);
    } catch (error) {
        reject(error);
    }
});
export const apiGetDetailPlaylist = (pid) => new Promise(async(resolve, reject) => {
    try {
        const respon = await axios({
            url: '/detailplaylist',
            method : 'get',
            params :{id: pid}
        })
        resolve(respon);
    } catch (error) {
        reject(error);
    }
})

export const uploadMusic = async (formData, token) => {
    try {
        const res = await callPath.post('music/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
            },
        });
        return res.data;
    } catch (error) {
        return { errorCode: error.response.status };
    }
};
