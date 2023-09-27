import { createSlice } from "@reduxjs/toolkit";
import { AllProjectDataType } from "../../../pages/dataset/hook/useDataset";

const initialState: AllProjectDataType = {}

export const projectData = createSlice({
  name: "projectData",
  initialState,
  reducers: {
    setProjectDataAction: (state, action) => {
      state.projectData = action.payload;
    },
  },
});


export const selectProjectData = (state: { projectData: {projectData:AllProjectDataType} }) => state.projectData;  //輸出slice的selector


export const { setProjectDataAction } = projectData.actions;  // 輸出action



export default projectData.reducer;