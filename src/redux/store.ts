import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import eventReducer from '../redux/slices/eventSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
