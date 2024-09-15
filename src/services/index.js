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
import { getDetailSong, uploadMusic, getPlaylist,getPlaylistByAccess, removeMusic, updateMusic } from './musicService';
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
    uploadMusic,
    getPlaylist,
    updateUser,
    removeMusic,
    updateMusic,
    getPlaylistByAccess,
    checkFollow,
};

export default config;
