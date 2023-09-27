import { createSlice } from "@reduxjs/toolkit";

export const currentTitle = createSlice({
  name: "currentTitle",
  initialState:{
    idTitle: {},
  },
  reducers: {
    setIdTitle: (state, action) => {
      state.idTitle = action.payload;
    },
  },
});


export const selectIdTitle = (state: { currentTitle: {idTitle:Record<string, string>}}) => state.currentTitle;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setIdTitle } = currentTitle.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default currentTitle.reducer;