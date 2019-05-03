import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

// Use the module as a plugin in order to use it globally
import historyPlugin from './plugins/historyPlugin';
Vue.use(historyPlugin);

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
  faMinus,
  faFilePdf,
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add icons to the library
library.add(
  faIndustry, faCartPlus, faCog, faFile, faTachometerAlt, faTimes, faArrowRight, faPlusCircle, faMinusCircle, 
  faPencilAlt, faCheck, faClipboardList, faArrowLeft, faPlus, faMinus, faFilePdf, faFileExcel,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
