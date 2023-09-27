import { createSlice } from "@reduxjs/toolkit";

export const isTraining = createSlice({
  name: "isTraining",
  initialState:{
    isTraining: '', //'start'| 'doing' | 'done'
  },
  reducers: {
    setIsTraining: (state, action) => {
      state.isTraining = action.payload;
    },
  },
});


export const selectIsTraining = (state: { isTraining: {isTraining:string} }) => state.isTraining;  //輸出slice的selector


export const { setIsTraining } = isTraining.actions;  // 輸出action



export default isTraining.reducer;