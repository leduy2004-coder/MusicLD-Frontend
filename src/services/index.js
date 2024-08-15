import login from './authLogin';
import logout from './authLogout';
import register from './authRegister';
import getUser from './getUser';
import { search } from './searchService';
import getAvatar from './getAvatar';
import uploadAvatar from './uploadAvatar';
import oauth2 from './oauth2Service';
import removeAvatar from './removeAvatar';
const config = {
    login,
    logout,
    register,
    getUser,
    search,
    getAvatar,
    uploadAvatar,
    oauth2,
    removeAvatar
};

export default config;
