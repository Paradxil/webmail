import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Mailbox from '../views/Mailbox.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'
import Settings from '../views/Settings.vue'
import Compose from '../views/Compose.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/mailbox',
    name: 'Mailbox',
    component: Mailbox
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/compose',
    name: 'Compose',
    component: Compose
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
