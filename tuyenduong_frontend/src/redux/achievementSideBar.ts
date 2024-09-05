import { createSlice } from '@reduxjs/toolkit'

const achievementSideBarSlice = createSlice({
  name: 'achievementSideBar',
  initialState: 0,
  reducers: {
    setAchievementSideBar: (state, action) => {
      return action.payload
    },
  },
})

const { actions, reducer } = achievementSideBarSlice
export const { setAchievementSideBar } = actions
export default reducer
