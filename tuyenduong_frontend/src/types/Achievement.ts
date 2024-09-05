interface Achievement {
  id?: number
  name?: string
  lock?: string
  softCriteria?: number
  description?: string
  type?: string
  auditorFinal?: any
  auditors?: any[]
  createdAt?: Date
  updatedAt?: Date
  endAt?: Date | null
  startAt?: Date | null
  endSubmitAt?: Date | null
}

export interface StatisticAchievement {
  name?: string
  no_confirmed?: number
  no_unconfirmed?: number
  no_all?: number
}

export default Achievement;
