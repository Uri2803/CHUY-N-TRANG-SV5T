import { Submission } from "../types/Submission";
import { createSlice, ThunkAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import {
  handleApplicationFileChange,
  handleApplicationBinaryChange,
  handleApplicationPointChange,
  handleApplicationStudentCommentChange,
  handleApplicationStudentSelectChange,
} from "../utils/critArrayHandler";
import submissionApi from "../api/Achievement/submissionApi";
import { RootState } from "../store";

let initialState: { list: Submission[] } = {
  list: [],
};

const dhSlice = createSlice({
  name: "submission",
  initialState: initialState,
  reducers: {
    loadAll: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    addSubmission: (state = initialState, action) => {
      return state;
    },
    genSubmission: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload.list,
      };
    },
    updatePoint: (state = initialState, action) => {
      handleApplicationPointChange(
        state.list,
        action.payload.subId,
        action.payload.point
      );
    },
    updateBin: (state = initialState, action) => {
      handleApplicationBinaryChange(
        state.list,
        action.payload.subId,
        action.payload.bin
      );
    },
    updateStudentComment: (state = initialState, action) => {
      handleApplicationStudentCommentChange(
        state.list,
        action.payload.subId,
        action.payload.studentComment
      );
    },
    updateStudentSelect: (state = initialState, action) => {
      handleApplicationStudentSelectChange(
        state.list,
        action.payload.subId,
        action.payload.studentSelect
      );
    },
    updateFile: (state = initialState, action) => {
      handleApplicationFileChange(
        state.list,
        action.payload.subId,
        action.payload.file
      );
    },
  },
});

const { actions, reducer } = dhSlice;

export const {
  addSubmission,
  genSubmission,
  updatePoint,
  updateBin,
  updateFile,
  loadAll,
  updateStudentComment,
  updateStudentSelect,
} = actions;
export default reducer;

export const fetchAll =
  (
    acvId: string,
    userId: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const data = await submissionApi.getAll(acvId, userId);
      dispatch(loadAll(data));
    } catch (err: any) {}
  };

export const addSubmissionAsync =
  (
    acvId: string,
    userId: string,
    data: Submission[]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await submissionApi.add(acvId, userId, data);
  };
