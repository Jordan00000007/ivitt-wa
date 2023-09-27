import { createSlice } from "@reduxjs/toolkit";

export const currentTab = createSlice({
  name: "currentTab",
  initialState:{
    tab: 'Dataset',
  },
  reducers: {
    setCurrentTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});


export const selectCurrentTab = (state: { currentTab: {tab:string} }) => state.currentTab;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setCurrentTab } = currentTab.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default currentTab.reducer;