import { createSlice } from "@reduxjs/toolkit";

export const currentIteration = createSlice({
  name: "currentIteration",
  initialState:{
    iteration: 'workspace',
  },
  reducers: {
    setIteration: (state, action) => {
      state.iteration = action.payload;
    },
  },
});


export const selectIteration = (state: { currentIteration: {iteration:string} }) => state.currentIteration;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setIteration } = currentIteration.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default currentIteration.reducer;