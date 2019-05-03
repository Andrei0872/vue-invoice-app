import { historyStore as history } from '../store/globals/history';

export default {
    history,
    install (Vue, options) {
        Vue.prototype.$history = history;
    }
}