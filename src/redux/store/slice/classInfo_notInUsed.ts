import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClassInfoType } from "../../../pages/dataset/hook/useDataset";

type InitialStateType = {
  pickedItem?: ClassInfoType,
}

const initialState: InitialStateType = {
  pickedItem: undefined
}

export const classInfo = createSlice({
  name: "classInfo",
  initialState,
  reducers: {
    setPickedItem: (state, action:PayloadAction<ClassInfoType>) => {
      state.pickedItem = action.payload;
    },
  },
});


export const selectClassInfo = (state:ClassInfoType) => state;  //輸出slice的selector

//使用資料
// import { useSelector } from "react-redux";
// import { selectCurrentPage } from "../store/slice/currentPage";

// const states = useSelector(selectCurrentPage); // <-- 拿取資料

export const { setPickedItem } = classInfo.actions;  // 輸出action

//取用reducer
// import { useDispatch } from "react-redux";
// import { changeCurrentPage } from "./store/slice/currentPage";

// const dispatch = useDispatch();

// const handleAddTodo = () => {
//   dispatch(
//     changeCurrentPage("a new todo item");
//   );
// };



export default classInfo.reducer;