import * as callPath from '../utils/httpRequest';

export const getCountMusicByYear = async (year, token) => {
    try {
        const res = await callPath.get('admin/get-count-music-by-year', token, {
            params: { year },
        });
        return res.result;
    } catch (errorCode) {
        return { errorCode: errorCode.response.status };
    }
};

export const getStatisticByYear = async (year, token) => {
    try {
        const res = await callPath.get('admin/get-statistic-by-year', token, {
            params: { year },
        });
        return res.result;
    } catch (errorCode) {
        return { errorCode: errorCode.response.status };
    }
};

export const getTopUserByYear = async (year, token) => {
    try {
        const res = await callPath.get('admin/get-top-user-by-year', token, {
            params: { year },
        });
        return res.result;
    } catch (errorCode) {
        return { errorCode: errorCode.response.status };
    }
};