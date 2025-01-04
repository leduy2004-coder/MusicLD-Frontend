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
import StatisticPage from '~/pages/Statistic';
import Upload from '~/pages/Upload';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly, private: true },
    { path: config.routes.statistic, component: StatisticPage, layout: AdminDefaultLayout, private: true, role: 'ADMIN' },
    { path: config.routes.upload, component: Upload},
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.oauth2, component: OAuth2Success },
    { path: config.routes.music, component: Music, private: true },
];
const privateRoutes = [];

export { privateRoutes, publicRoutes };

