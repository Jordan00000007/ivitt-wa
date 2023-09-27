import { createSlice } from "@reduxjs/toolkit";


export const loading = createSlice({
  name: "loading",
  initialState:{
    isOpen: false,
  },
  reducers: {
    openLoading: (state) => {
      state.isOpen = true;
    },
    closeLoading: (state) => {
      state.isOpen = false;
    },
  },
});

//輸出slice的selector
export const getLoading = (state:{loading:{isOpen:boolean}}) => state.loading;   

// 輸出action
export const { openLoading, closeLoading } = loading.actions; 



export default loading.reducer;