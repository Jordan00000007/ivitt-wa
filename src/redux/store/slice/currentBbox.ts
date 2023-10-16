import { createSlice } from "@reduxjs/toolkit";

export type BboxType = {
    class_id: number, 
    color_hex: string,
    bbox: number[] 
  };

export const currentBbox = createSlice({
    name: "currentBbox",
    initialState: {
        bbox: [],
        autobox: [],
        sizeInfo:{
            imageWidth: 1,
            imageHeight: 1,
            mediaWidth: 1,
            mediaHeight: 1
        },
        labelIndex:-1,
        aiLabelIndex:-1,
        imageName:'',
        classInfo:[],
        classEditingIndex:-1,
        
      
       
    },
    reducers: {
        setCurrentBbox: (state, action) => {
            state.bbox = action.payload;
        },
        setSizeInfo: (state, action) => {
            state.sizeInfo = action.payload;
        },
        setLabelIndex: (state, action) => {
            state.labelIndex = action.payload;
        },
        setAiLabelIndex: (state, action) => {
            state.aiLabelIndex = action.payload;
        },
        setImageName: (state, action) => {
            state.imageName = action.payload;
        },
        setClassInfo: (state, action) => {
            state.classInfo = action.payload;
        },
        setClassEditingIndex: (state, action) => {
            state.classEditingIndex = action.payload;
        },
      
        setAutoBox: (state, action) => {
            state.autobox = action.payload;
        },
      
       
    },
});


export const selectCurrentBbox = (state: { currentBbox: { bbox: [],sizeInfo:{},labelIndex:number,aiLabelIndex:number } }) => state.currentBbox;  

export const { setCurrentBbox, setSizeInfo, setLabelIndex, setAiLabelIndex, setImageName,setClassInfo,setClassEditingIndex,setAutoBox } = currentBbox.actions;  // 輸出action

export default currentBbox.reducer;