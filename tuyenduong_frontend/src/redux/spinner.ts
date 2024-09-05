import { createSlice } from '@reduxjs/toolkit'

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState: false,
  reducers: {
    setSpinner: (state, action) => {
      return action.payload
    },
  },
})

const { actions, reducer } = spinnerSlice
export const { setSpinner } = actions
export default reducer
