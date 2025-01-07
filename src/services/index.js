import { login, logout, register, oauth2 } from './authService';
import { getAvatar, removeAvatar, uploadAvatar,uploadAvatarUser } from './avatarService.js';
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
    updateStatusMusic,
} from './musicService';
import { addUser,search, getUser, updateUser, getTopUser, getAllUser, deleteUser, getUserForAdmin } from './userService.js';
import { getComment, addComment, updateComment, removeComment } from './commentService';
import { getVNPay } from './paymentService';
import { getCountMusicByYear, getStatisticByYear, getTopUserByYear } from './statisticService';
const config = {
    login,
    logout,
    register,
    addUser,
    getUser,
    search,
    getAvatar,
    uploadAvatar,
    uploadAvatarUser,
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
    updateStatusMusic,
    updateMusic,
    getPlaylistByAccess,
    checkFollow,
    getTopUser,
    getAllUser,
    deleteUser,
    getUserForAdmin,
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
