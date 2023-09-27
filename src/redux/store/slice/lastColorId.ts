import { createSlice } from "@reduxjs/toolkit";

export const lastColorId = createSlice({
  name: "lastColorId",
  initialState:{
    lastColorId: '', 
  },
  reducers: {
    setLastColorIdAction: (state, action) => {
      state.lastColorId = action.payload;
    },
  },
});


export const selectLastColorId = (state: { lastColorId: {lastColorId:string} }) => state.lastColorId;  //輸出slice的selector


export const { setLastColorIdAction } = lastColorId.actions;  // 輸出action



export default lastColorId.reducer;