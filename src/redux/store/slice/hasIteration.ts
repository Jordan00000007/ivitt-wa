import { createSlice } from "@reduxjs/toolkit";

export const hasIteration = createSlice({
  name: "hasIteration",
  initialState:{
    hasIteration: null,
  },
  reducers: {
    setHasIteration: (state, action) => {
      state.hasIteration = action.payload;
    },
  },
});


export const selectHasIteration = (state: { hasIteration: {hasIteration:boolean} }) => state.hasIteration;  //輸出slice的selector


export const { setHasIteration } = hasIteration.actions;  // 輸出action



export default hasIteration.reducer;