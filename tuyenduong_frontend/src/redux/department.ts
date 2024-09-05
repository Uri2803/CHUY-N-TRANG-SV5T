import { createSlice } from "@reduxjs/toolkit";
import Department from "../types/Department";

let initialState: {
  list: Department[];
} = { list: [] };

const departmentSlice = createSlice({
  name: "department",
  initialState: initialState,
  reducers: {
    getAll: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    addDepartment: (state = initialState, action) => {
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    },
    updateDepartment: (state = initialState, action) => {
      const objIndex = state.list.findIndex(
        (obj) => obj.id === action.payload.id
      );
      state.list[objIndex] = action.payload;
    },
    deleteDepartment: (state = initialState, action) => {
      return {
        ...state,
        list: state.list.filter((item) => item.id !== action.payload.id),
      };
    },
  },
});

const { actions, reducer } = departmentSlice;

export const {
  getAll,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = actions;
export default reducer;

export const generateNewId = (data: Department[]): number => {
  let newId = Math.floor(Math.random() * 10000000)
  for (const item of data) {
    if (item.id === newId) {
      newId = generateNewId(data);
    }
  }
  return newId;
};
