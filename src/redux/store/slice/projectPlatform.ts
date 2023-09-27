import { createSlice } from "@reduxjs/toolkit";

export const projectPlatform = createSlice({
  name: "projectPlatform",
  initialState:{
    platformIdMap: {},
  },
  reducers: {
    setPlatformIdMap: (state, action) => {
      state.platformIdMap = action.payload;
    },
  },
});


export const selectPlatformMap = (state: { projectPlatform: {platformIdMap:Record<string, string>} }) => state.projectPlatform;  //輸出slice的selector


export const { setPlatformIdMap } = projectPlatform.actions;  // 輸出action


export default projectPlatform.reducer;