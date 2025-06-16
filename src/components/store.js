import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import your user slice
import { loadState, saveState } from './localStorage';

const persistedState = loadState();
const store = configureStore({
  reducer: {
    userLogin: userReducer, // Add your user reducer here
    // ...other reducers
  },
  preloadedState: persistedState,
});

// Subscribe to store updates and save userLogin slice
store.subscribe(() => {
  saveState({
    userLogin: store.getState().userLogin,
  });
});
export default store;