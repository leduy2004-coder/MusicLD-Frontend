import { login, logout, register, oauth2 } from './authService';
import { getAvatar, removeAvatar, uploadAvatar } from './avatarService.js';
import {
    updateRequestFollowUser,
    getAllFollower,
    getAllFollowing,
    getAllReceive,
    getAllRequest,
} from './followService';
import { getDetailSong, getSong, uploadMusic, getPlaylist, removeMusic, updateMusic } from './musicService';
import { search, getUser,updateUser } from './userService.js';
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
    uploadMusic,
    getPlaylist,
    updateUser,
    removeMusic,
    updateMusic,
};

export default config;
