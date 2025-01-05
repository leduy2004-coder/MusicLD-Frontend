import { login, logout, register, oauth2 } from './authService';
import { getAvatar, removeAvatar, uploadAvatar } from './avatarService.js';
import {
    updateRequestFollowUser,
    getAllFollower,
    getAllFollowing,
    getAllReceive,
    getAllRequest,
    checkFollow,
    getStatusFollow,
} from './followService';
import {
    getDetailSong,
    uploadMusic,
    getPlaylist,
    getPlaylistByAccess,
    removeMusic,
    updateMusic,
    likeMusic,
    unLikeMusic,
    getCountMusic,
    getTopMusic,
} from './musicService';
import { search, getUser, updateUser, getTopUser, getAllUser } from './userService.js';
import { getComment, addComment, updateComment, removeComment } from './commentService';
import { getVNPay } from './paymentService';
import {getCountMusicByYear, getStatisticByYear, getTopUserByYear} from './statisticService'
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
    getStatusFollow,
    getAllRequest,
    getAllReceive,
    getDetailSong,
    uploadMusic,
    getPlaylist,
    updateUser,
    removeMusic,
    getTopMusic,
    updateMusic,
    getPlaylistByAccess,
    checkFollow,
    getTopUser,
    getAllUser,
    getComment,
    updateComment,
    removeComment,
    addComment,
    likeMusic,
    unLikeMusic,
    getCountMusic,
    getVNPay,
    getCountMusicByYear,
    getStatisticByYear,
    getTopUserByYear,
};

export default config;
