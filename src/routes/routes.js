import config from '~/config';

//Layouts
import  layouts, { HeaderOnly } from '~/layouts';

//Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Music from '~/pages/Music';
import OAuth2Success from '~/pages/Oauth2';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
    { path: config.routes.upload, component: Upload},
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.oauth2, component: OAuth2Success },
    { path: config.routes.music, component: Music },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
