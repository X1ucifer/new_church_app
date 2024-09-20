import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('isAuthenticated', 'true');
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        },
        loadUserFromStorage: (state) => {
          const storedUser = localStorage.getItem('user');
          const user = storedUser ? JSON.parse(storedUser) : null;

            if (user) {
                state.user = user;
                state.isAuthenticated = true;
            }
        },
    },
});

export const { loginSuccess, logout, loadUserFromStorage } = authSlice.actions;

export default authSlice.reducer;
