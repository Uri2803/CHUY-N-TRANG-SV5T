import { createSlice } from '@reduxjs/toolkit'
import Auditor from './../types/Auditor'

let initialState: Auditor[] = []
// examerId: 0,
// achievementId: 0,
// soft: 0,
// criterias: [],

const auditorSlice = createSlice({
  name: 'auditor',
  initialState,
  reducers: {
    setInitCriteria: (state, action) => {
      return action.payload
    },
    updateCriteria: (state, action) => {
      const { examerId, criteria } = action.payload
      const stateExamer = state.map((sub: any) => {
        if (sub.examerId === examerId) {
          const criterias = sub.criterias.map((crit: any) => {
            if (crit.id === criteria.id) return { ...crit, ...criteria }
            return crit
          })
          return {...sub, criterias}
        }
        return sub
      })

      return stateExamer
    },
  },
})

const { actions, reducer } = auditorSlice
export const { setInitCriteria, updateCriteria } = actions
export default reducer
