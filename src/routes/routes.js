import config from '~/config';

//Layouts
import { HeaderOnly } from '~/layouts';

//Pages
import AdminDefaultLayout from '~/layouts/Admin_DefaultLayout';
import Following from '~/pages/Following';
import Home from '~/pages/Home';
import Music from '~/pages/Music';
import OAuth2Success from '~/pages/Oauth2';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import StatisticPage from '~/pages/Admin_Statistic';
import AdminUserPage from '~/pages/Admin_User';
import AdminMusicPage from '~/pages/Admin_Music';
import FormAddMusic from '~/components/FormAdmin/FormAddMusic';
import Upload from '~/pages/Upload';
import AdminUserDetail from '~/components/Admin_User/AdminUserDetail';
import AdminMusicDetail from '~/components/Admin_Music/AdminMusicDetail';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly, private: true },
    { path: config.routes.upload, component: Upload },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.oauth2, component: OAuth2Success },
    { path: config.routes.music, component: Music, private: true },
    {
        path: config.routes.statistic,
        component: StatisticPage,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
    {
        path: config.routes.admin_user,
        component: AdminUserPage,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
    {
        path: config.routes.admin_music,
        component: AdminMusicPage,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
    {
        path: config.routes.admin_music_add,
        component: FormAddMusic,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
    {
        path: config.routes.admin_music_detail,
        component: AdminMusicDetail,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
    {
        path: config.routes.admin_user_detail,
        component: AdminUserDetail,
        layout: AdminDefaultLayout,
        private: true,
        role: 'ADMIN',
    },
];
const privateRoutes = [];

export { privateRoutes, publicRoutes };
