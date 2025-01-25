import { login, logout, register, oauth2 } from './authService';
import { getAvatar, removeAvatar, uploadAvatar, uploadAvatarUser } from './avatarService.js';
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
    getAllMusic,
    getDetailSong,
    uploadMusic,
    uploadMusicOfAdmin,
    getPlaylist,
    getPlaylistByAccess,
    removeMusic,
    updateMusic,
    getAllUserLike,
    likeMusic,
    unLikeMusic,
    getCountMusic,
    getTopMusic,
    updateStatusMusic,
    updateMusicOfAdmin,
} from './musicService';
import {
    addUser,
    search,
    getUser,
    updateUser,
    getTopUser,
    getAllUser,
    deleteUser,
    getUserForAdmin,
    changePassword
} from './userService.js';
import {
    getAllComments,
    getComment,
    addComment,
    updateComment,
    removeComment,
    getAllCommentsByRoot,
} from './commentService';
import { getVNPay } from './paymentService';
import { getCountMusicByYear, getStatisticByYear, getTopUserByYear } from './statisticService';
import { chat } from './chatService';
import {verifyAccount, generateOtp} from './emailService'
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
    getAllMusic,
    getDetailSong,
    uploadMusic,
    uploadMusicOfAdmin,
    getPlaylist,
    updateUser,
    removeMusic,
    getTopMusic,
    updateStatusMusic,
    updateMusicOfAdmin,
    updateMusic,
    getPlaylistByAccess,
    checkFollow,
    getTopUser,
    getAllUser,
    deleteUser,
    getUserForAdmin,
    getAllComments,
    getAllCommentsByRoot,
    getComment,
    updateComment,
    removeComment,
    addComment,
    getAllUserLike,
    likeMusic,
    unLikeMusic,
    getCountMusic,
    getVNPay,
    getCountMusicByYear,
    getStatisticByYear,
    getTopUserByYear,
    chat,
    verifyAccount,
    generateOtp,
    changePassword
};

export default config;
