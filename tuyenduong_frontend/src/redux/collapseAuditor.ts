import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  image : {
    isCollapse : false,
    file: '',
  },
  description : {
    isCollapse : false,
    title: '',
    id: '',
    content: '',
  },
  result:{
    isCollapse : false,
    data:[]
  }
}

const collapseSlice = createSlice({
  name: 'collapse',
  initialState,
  reducers: {
    setImage: (state, action) => {
      return { ...state , image:action.payload}
    },
    setDescription: (state, action) => {
      return { ...state, description:action.payload}
    },
    setResult : (state, action) => {
      return { ...state, result:action.payload}
    }
  },
})

const { actions, reducer } = collapseSlice
export const { setImage, setDescription, setResult } = actions
export default reducer
