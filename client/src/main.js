import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

import { library } from '@fortawesome/fontawesome-svg-core';
// Load Icons
import {
  faIndustry,
  faCartPlus,
  faCog,
  faFile,
  faTachometerAlt,
  faTimes,
  faArrowRight,
  faArrowLeft,
  faPlusCircle,
  faMinusCircle,
  faPencilAlt,
  faCheck,
  faClipboardList,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add icons to the library
library.add(
  faIndustry, faCartPlus, faCog, faFile, faTachometerAlt, faTimes, faArrowRight, faPlusCircle, faMinusCircle, 
  faPencilAlt, faCheck, faClipboardList, faArrowLeft, faPlus, faMinus
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
