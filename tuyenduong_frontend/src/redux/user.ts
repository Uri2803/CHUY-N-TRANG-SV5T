import { createSlice } from "@reduxjs/toolkit";
import User from "../types/User";

const initialState: User = {
  id: 0,
  email: "",
  isRegisteredWithGoogle: false,
  role: "",
  name: "",
  mssv: 0,
  youthUnion: "",
  isUpdatedInformation: false,
  surName: "",
  auditors: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUser } = actions;
export default reducer;
