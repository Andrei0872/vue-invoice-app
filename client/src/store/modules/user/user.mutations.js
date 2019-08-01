export const mutations = {
    SET_USER: (state, user) => {
        state.currentUser = user;

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    },
};