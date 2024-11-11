const routes = {
    home: '/:login?',
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