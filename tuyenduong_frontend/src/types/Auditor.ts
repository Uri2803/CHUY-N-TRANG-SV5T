interface Auditor {
  examerId: number
  achievementId: number
  soft: number
  criterias: resultAuditor[]
}

export interface resultAuditor {
  idCriteria: string
  result: boolean
  description: string
}

export interface AuditorForAchievement {
  id?: number
  name?: string
  surName?: string
  email: string
  isFinal: boolean
  department: any[]
}

export default Auditor
