// import Home from 'views/Home.vue'
import About from 'views/About.vue'
import Index from 'views/Index.vue'
// import Page from 'views/Page.vue'
import test from '../features/test'
import nettunnel from '../features/nettunnel'

export default [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      keepAlive: true // keepAlive will allow the page to load only once
    }
  },
  // {
  //   path: '/page',
  //   name: 'Page',
  //   component: Page
  // },
  {
    path: 'features/test',
    name: 'cn.miao7.test',
    component: test.page
  },
  {
    path: 'features/nettunnel',
    name: 'cn.miao7.nettunnel',
    component: nettunnel.page
  },
  {
    path: '/about',
    name: 'About',
    component: About
    /* route level code-splitting
    this generates a separate chunk (about.[hash].js) for this route
    which is lazy-loaded when the route is visited. */
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]
