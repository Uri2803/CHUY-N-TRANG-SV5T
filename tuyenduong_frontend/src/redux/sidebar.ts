import { createSlice } from "@reduxjs/toolkit";


const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: "responsive",
  reducers: {
    setSidebar: (state, action) => {
      return action.payload;
    },
  },
});

const { actions, reducer } = sidebarSlice;
export const { setSidebar } = actions;
export default reducer;
