export const mutations = {
    SET_USER: (state, user) => {
        const updatedUser = {
            ...state.currentUser,
            ...user,
        };

        state.currentUser = updatedUser;
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    },
};