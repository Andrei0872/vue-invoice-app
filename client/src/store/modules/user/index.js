export const namespaced = true;

export const state = {
    currentUser: localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')) || null,

    userUrl: 'auth/',
};

export { mutations } from './user.mutations';

export { actions } from './user.actions';