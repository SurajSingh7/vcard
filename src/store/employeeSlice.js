// src/redux/employeeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEmployee: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
});

export const { setSelectedEmployee, clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
