import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Movie from '../views/Movie'
import Auth from '@okta/okta-vue'

Vue.use(VueRouter);
Vue.use(Auth, {
    issuer: "https://dev-316499.okta.com/oauth2/default",
    clientId: "0oa2c6i3wfuGXZcHm357",
    redirectUri: "http://localhost:8080/implicit/callback",
    scopes: ["openid", "profile", "email"],
    pkce: true
});


const routes = [

    {
        path: "/implicit/callback",
        component: Auth.handleCallback()
    },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/favourites',
    name: 'favourites',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Favourites.vue')
  },
    {
        path: '/movie/:id',
        name: 'Movie',
        component: Movie
    }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router
