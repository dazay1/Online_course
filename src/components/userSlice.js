import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  userInfo: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  // ... any other user-related state
};

const userSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isSuccess = true;
      state.isLoading = false;
      state.isError = false;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isSuccess = false;
    },
    // other actions...
  },
});
export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;