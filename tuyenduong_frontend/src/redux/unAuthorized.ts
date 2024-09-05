import { createSlice } from '@reduxjs/toolkit'

const UnAuthorizedSlice = createSlice({
  name: 'UnAuthorized',
  initialState: false,
  reducers: {
    setUnAuthorized: (state, action) => {
      return action.payload
    },
  },
})

const { actions, reducer } = UnAuthorizedSlice
export const { setUnAuthorized } = actions
export default reducer
