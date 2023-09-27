import { createSlice } from "@reduxjs/toolkit";

export const disableBtn = createSlice({
  name: "disableBtn",
  initialState:{
    disableBtn: null,
  },
  reducers: {
    setDisableBtn: (state, action) => {
      state.disableBtn = action.payload;
    },
  },
});


export const selectDisableBtn = (state: {disableBtn: {disableBtn: boolean}}) => state.disableBtn;  //輸出slice的selector


export const { setDisableBtn } = disableBtn.actions;  // 輸出action



export default disableBtn.reducer;