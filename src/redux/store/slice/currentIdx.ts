import { createSlice } from "@reduxjs/toolkit";

export const currentIdx = createSlice({
  name: "currentIdx",
  initialState:{
    idx: 0,
  },
  reducers: {
    setCurrentIdx: (state, action) => {
      state.idx = action.payload;
    },
  },
});


export const selectCurrentIdx = (state: { currentIdx: {idx:number} }) => state.currentIdx;  //輸出slice的selector

export const { setCurrentIdx } = currentIdx.actions;  // 輸出action

export default currentIdx.reducer;