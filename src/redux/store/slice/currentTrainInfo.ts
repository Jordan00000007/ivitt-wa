import { createSlice } from "@reduxjs/toolkit";

export const currentTrainInfo = createSlice({
  name: "currentTrainInfo",
  initialState:{
    currTrain:{}
  },
  reducers: {
    setCurrentTrainInfo: (state, action) => {
      state.currTrain = action.payload;
    },
  },
});


export const selectCurrentTrainInfo = (state: { currentTrainInfo: {currTrain:any}}) => state.currentTrainInfo;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setCurrentTrainInfo } = currentTrainInfo.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default currentTrainInfo.reducer;