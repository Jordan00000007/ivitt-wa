import { createSlice } from "@reduxjs/toolkit";

export const currentClassInfo = createSlice({
  name: "currentClassInfo",
  initialState: {
    classInfo: [],
    classInfoPrev: [],
    classEditingIndex: -1,
    classSelectedIndex: -1,
    favLabels:[],
   
  },
  reducers: {
    setClassInfo: (state, action) => {
      state.classInfo = action.payload;
    },
    setClassInfoPrev: (state, action) => {
      state.classInfoPrev = action.payload;
    },
    setClassEditingIndex: (state, action) => {
      state.classEditingIndex = action.payload;
    },
    setClassSelectedIndex: (state, action) => {
      state.classSelectedIndex = action.payload;
    },
    setFavLabels: (state, action) => {
      state.favLabels = action.payload;
    },
   
  },
  
});


export const selectCurrentClassInfo = (state: { currentClassInfo: { classInfo: [] } }) => state.currentClassInfo;  //輸出slice的selector

export const { setClassInfo,setClassInfoPrev,setClassEditingIndex,setClassSelectedIndex,setFavLabels} = currentClassInfo.actions;  // 輸出action

export default currentClassInfo.reducer;