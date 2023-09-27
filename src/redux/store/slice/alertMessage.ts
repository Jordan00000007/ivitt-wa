import { createSlice } from "@reduxjs/toolkit";
import { AlertTypes } from "../../../component/AlertMessage";

type AlertMessageType = {
  message: string,
  alertType: AlertTypes,
  show: boolean,
}

const initialState = {
  message: '',
  alertType: 'success',
  show: false,
}

export const alertMessage = createSlice({
  name: "alertMessage",
  initialState:initialState,
  reducers: {
    createAlertMessage: (state, action) => {
      state.message = action.payload.message;
      state.alertType = action.payload.alertType;
      state.show = true;
    },
    closeAlertMessage: (state) => {
      state.message = '';
      state.show = false;
    },
  },
});

//輸出slice的selector
export const getAlertMessage = (state: {alertMessage: AlertMessageType}) => state.alertMessage;   

// 輸出action
export const { createAlertMessage, closeAlertMessage } = alertMessage.actions; 



export default alertMessage.reducer;