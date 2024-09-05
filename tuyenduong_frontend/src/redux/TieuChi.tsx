import { Criteria } from "../types/TieuChi";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  handleAdd,
  handleDelete,
  handleModify,
  handleUpdateSoft,
} from "../utils/critArrayHandler";
import store from "../store";

import critApi from "../api/Achievement/critApi";

let initialState: { list: Criteria[] } = {
  list: [],
};

const dhSlice = createSlice({
  name: "criteria",
  initialState: initialState,
  reducers: {
    tempAddCrit: (state = initialState, action) => {
      if (action.payload.parentId === 0) {
        return {
          ...state,
          list: [...state.list, action.payload.item],
        };
      } else {
        handleAdd(state.list, action.payload.item, action.payload.parentId);
      }
    },
    deleteCrit: (state, action) => {
      state.list = handleDelete(state.list, action.payload.itemId).resultArr;
    },
    modifyCrit: (state = initialState, action) => {
      handleModify(state.list, action.payload.item, action.payload.parentId);
    },
    fetchCrit: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    updateSoft: (state = initialState, action) => {
      handleUpdateSoft(state.list, action.payload.critId, action.payload.soft);
    },
  },
});

const { actions, reducer } = dhSlice;

export const { deleteCrit, modifyCrit, fetchCrit, tempAddCrit, updateSoft } =
  actions;
export default reducer;

export const fetchAll =
  (id: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const data = await critApi.getAll(id);
      dispatch(fetchCrit(data));
    } catch (error: any) {
      console.log(error.message);
    }
  };

export const saveState =
  (
    id: string,
    deletedID: string[]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await critApi.add(id, {
      list: store.getState().tieuchi.list,
      deletedID: deletedID,
    });
  };
