import { createSlice } from "@reduxjs/toolkit";

export const socketId = createSlice({
  name: "socketId",
  initialState:{
    socketId: '',
  },
  reducers: {
    setSocketIdAction: (state, action) => {
      state.socketId = action.payload;
    },
  },
});


export const selectSocketId = (state: { socketId: {socketId:string} }) => state.socketId;  //輸出slice的selector

export const { setSocketIdAction } = socketId.actions;  // 輸出action



export default socketId.reducer;