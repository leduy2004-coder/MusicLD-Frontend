import login from './authLogin';
import logout from './authLogout';
import register from './authRegister';
import getUser from './getUser';
import { search } from './searchService';
import getAvatar from './getAvatar';
import uploadAvatar from './uploadAvatar';
import oauth2 from './oauth2Service';
import removeAvatar from './removeAvatar';
import { updateRequestFollowUser,getAllFollower,getAllFollowing,getAllReceive,getAllRequest } from './follow';
import { getDetailSong,getSong,uploadMusic } from './musicService';
const config = {
    login,
    logout,
    register,
    getUser,
    search,
    getAvatar,
    uploadAvatar,
    oauth2,
    removeAvatar,
    updateRequestFollowUser,
    getAllFollower,
    getAllFollowing,
    getAllRequest,
    getAllReceive,
    getDetailSong,
    getSong,
    uploadMusic
};

export default config;
