import { createSlice } from "@reduxjs/toolkit";
import { cloneData } from "react-chartjs-2/dist/utils";

export const currentIdx = createSlice({
  name: "currentIdx",
  initialState:{
    idx: 0,
    imgDataList:[],
    imgBoxList:[],
    dataSetList:[]
  },
  reducers: {
    setCurrentIdx: (state, action) => {
      state.idx = action.payload;
    },
    setImgDataList: (state, action) => {
      state.imgDataList = action.payload;
    },
    setImgBoxList: (state, action) => {
      state.imgBoxList = action.payload;
    },
    setDataSetList: (state, action) => {
      state.dataSetList = action.payload;
    },
    updateBoxInfo: (state, action) => {
      //state.dataSetList = action.payload;
      console.log('update box info ===>',action.payload)
    

    },
  },
});


export const selectCurrentIdx = (state: { currentIdx: {idx:number},imgDataList: [],imgBoxList:[] }) => state.currentIdx;  //輸出slice的selector

export const { setCurrentIdx,setImgDataList,setImgBoxList,setDataSetList,updateBoxInfo } = currentIdx.actions;  // 輸出action

export default currentIdx.reducer;