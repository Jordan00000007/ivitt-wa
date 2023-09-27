import { createSlice } from "@reduxjs/toolkit";

export const selectedClass = createSlice({
  name: "selectedClass",
  initialState:{
    selectedClass: '',
  },
  reducers: {
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
  },
});


export const getSelectedClass = (state: { selectedClass: {selectedClass:string} }) => state.selectedClass;  //輸出slice的selector

export const { setSelectedClass } = selectedClass.actions;  // 輸出action



export default selectedClass.reducer;