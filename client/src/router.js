import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'

// component: () => import(/* webpackChunkName: "about" */ './views/About.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})
