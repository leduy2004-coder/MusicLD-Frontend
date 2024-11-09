import { login, logout, register, oauth2 } from './authService';
import { getAvatar, removeAvatar, uploadAvatar } from './avatarService.js';
import {
    updateRequestFollowUser,
    getAllFollower,
    getAllFollowing,
    getAllReceive,
    getAllRequest,
    checkFollow
} from './followService';
import { getDetailSong, uploadMusic, getPlaylist,getPlaylistByAccess, removeMusic, updateMusic ,likeMusic,unLikeMusic} from './musicService';
import { search, getUser,updateUser, getTopUser } from './userService.js';
import {getComment, addComment, updateComment, removeComment} from './commentService';
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
    uploadMusic,
    getPlaylist,
    updateUser,
    removeMusic,
    updateMusic,
    getPlaylistByAccess,
    checkFollow,
    getTopUser,
    getComment,
    updateComment,
    removeComment,
    addComment,
    likeMusic,
    unLikeMusic,

};

export default config;
