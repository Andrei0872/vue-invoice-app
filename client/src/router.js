import Vue from 'vue'
import Router from 'vue-router'

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

export default new Router({
  mode: 'history',
  routes: [
    loadComp('/', null, 'dashboard'),
    loadComp('/settings'),
    loadComp('/products'),
    loadComp('/providers'),
    loadComp('/documents'),
  ]
})
