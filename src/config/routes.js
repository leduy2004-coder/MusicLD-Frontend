const routes = {
    home: '/:login?',
    following: '/following',
    profile: '/profile/:id',
    upload: '/upload',
    search: '/search',
    live: '/live',
    oauth2: '/login/oauth2/code/:provider',
    login: '/login',
};

export default routes;