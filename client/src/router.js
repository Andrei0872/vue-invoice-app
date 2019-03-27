import Vue from 'vue'
import Router from 'vue-router'
import store from './store/';

import { capitalize } from './utils';

const loadComp = (path = '/', children = null, name = path.slice(1), component = capitalize(name)) => {
  return {
    path,
    component: () => import(`./views/${component}`),
    ...{ hasChildren: children !== null }.hasChildren && {
      children
    } || { name }
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
    loadComp('/documents', [
      loadComp('', null, 'documents'),
      { ...loadComp('edit/:id(\\d+)', null, 'documentEditOne'), props: true }
    ], undefined, 'DocumentHome'),
  ]
})

const entities = ["documents", "products", "providers"];
router.beforeEach((to, from, next) => {
  entities.includes(to.name) && store.dispatch('changeEntity', to.name)
  
  next();
});

export default router;