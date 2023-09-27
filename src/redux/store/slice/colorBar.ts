import { createSlice } from "@reduxjs/toolkit";

export const colorBar = createSlice({
  name: "colorBar",
  initialState:{
    colorBar: {},
  },
  reducers: {
    setColorBars: (state, action) => {
      state.colorBar = action.payload;
    },
  },
});


export const selectColorBar = (state: { colorBar: {colorBar:Record<string, string>}}) => state.colorBar;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setColorBars } = colorBar.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default colorBar.reducer;