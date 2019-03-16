import Vue from 'vue'
import Router from 'vue-router'
import store from './store/';

import { capitalize } from './utils';

const loadComp = (path = '/', children = null, name = path.slice(1), component = capitalize(name)) => {
  return {
    path, 
    name,
    component: () => import(`./views/${component}`),
    ...{ hasChildren: children !== null }.hasChildren && {
      children
    }
  }
}


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    loadComp('/', null, 'dashboard'),
    loadComp('/settings'),
    loadComp('/products'),
    loadComp('/providers'),
    loadComp('/documents'),
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('changeEntity', to.name)
  
  next();
});

export default router;