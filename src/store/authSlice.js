 'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  token: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setToken, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
