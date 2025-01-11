const routes = {
    home: '/:login?',
    statistic: '/admin/statistic',
    admin_music: '/admin/music',
    admin_music_add: '/admin/music/add',
    admin_music_detail: '/admin/music/detail/:id',
    admin_user: '/admin/user',
    admin_user_detail: '/admin/user/detail/:id',
    admin_about: '/admin/about',
    following: '/following',
    profile: '/profile/:id',
    upload: '/upload',
    search: '/search',
    oauth2: '/login/oauth2/code/:provider',
    payment: '/api/payment/vn-pay-callback',
    login: '/login',
    music: '/music/:id',
};

export default routes;