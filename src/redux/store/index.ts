import { configureStore } from "@reduxjs/toolkit";
import currentTitleReducer from "./slice/currentTitle";
import alertMessageReducer from "./slice/alertMessage";
import loadingReducer from "./slice/loading"
import selectedClassReducer from "./slice/selectedClass"
import currentIterationReducer from "./slice/currentIteration"
import currentTabReducer from "./slice/currentTab"
import hasIterationReducer from './slice/hasIteration'
import projectPlatformReducer from './slice/projectPlatform'
// import currentClassAndNumberReducer from "./slice/currentClassAndNumber";
import isTrainingReducer from './slice/isTraining'
import currentTrainInfoReducer from './slice/currentTrainInfo'
import socketIdReducer from './slice/socketId'
import colorBarReducer from './slice/colorBar'
import disableBtnReducer from './slice/disableBtn'
import lastColorIdReducer from './slice/lastColorId'
import projectDataReducer from './slice/projectData'

export const store =  configureStore({
  reducer: {
    currentTitle: currentTitleReducer,
    alertMessage: alertMessageReducer,
    loading: loadingReducer,
    selectedClass: selectedClassReducer,
    currentIteration:currentIterationReducer,
    currentTab:currentTabReducer,
    hasIteration:hasIterationReducer,
    projectPlatform: projectPlatformReducer,
    // currentClassAndNumber: currentClassAndNumberReducer,
    isTraining:isTrainingReducer,
    currentTrainInfo:currentTrainInfoReducer,
    socketId:socketIdReducer,
    colorBar:colorBarReducer,
    disableBtn:disableBtnReducer,
    lastColorId: lastColorIdReducer,
    projectData:projectDataReducer
  },
});