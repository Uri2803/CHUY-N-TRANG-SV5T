import Achievement from '../../types/Achievement'
import axiosClient from '../axiosClient'
import queryString from 'query-string'

const achievementApi = {
  getAll: (
    type: string = 'ACHIEVEMENT'
  ): Promise<Achievement[]> => {
    const url = `/achievement?type=${type}`
    return axiosClient.get(url)
  },
  getWithFilter: (
    filters: any,
    managerAchievement: boolean = false,
    type: string = 'ACHIEVEMENT'
  ): Promise<{
    data: Achievement[]
    count: number
  }> => {
    if (managerAchievement) filters.isAuditor = true
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/filter?${paramsString}&type=${type}`
    return axiosClient.get(url)
  },
  getAllWithFilter: (
    filters: any,
    managerAchievement: boolean = false,
    type: string = 'ACHIEVEMENT',
    idAchievement: string = '',
  ): Promise<{
    data: Achievement[]
    count: number
  }> => {
    if (managerAchievement) filters.isAuditor = true
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/all/filter?${paramsString}&type=${type}&idAchievement=${idAchievement}`
    return axiosClient.get(url)
  },
  getAllToExport: (
    filters: any,
    managerAchievement: boolean = false,
    type: string = 'ACHIEVEMENT',
    idAchievement: string = '',
  ): Promise<{
    data: Achievement[]
    count: number
  }> => {
    if (managerAchievement) filters.isAuditor = true
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/department/all/filter?${paramsString}&type=${type}&idAchievement=${idAchievement}`
    return axiosClient.get(url)
  },
  get: (id: number): Promise<Achievement> => {
    const url = `/achievement/${id}`
    return axiosClient.get(url)
  },
  copyAllResult: (id: number): Promise<any> => {
    const url = `/achievement/all-submission/${id}`
    return axiosClient.post(url)
  },
  getManageUnit: (id: string): Promise<any> => {
    const url = `/achievement/manageUnit/${id}`
    return axiosClient.get(url)
  },
  add: (data: Achievement): Promise<Achievement> => {
    const url = '/achievement'
    return axiosClient.post(url, data)
  },
  update: (id: string, data: Achievement): Promise<Achievement> => {
    const url = '/achievement'
    return axiosClient.put(`${url}/${id}`, data)
  },
  updateManageUnit: (
    id: string,
    data: { email: string; codeDepartment: string }
  ): Promise<Achievement> => {
    const url = `/achievement/manageUnit/${id}`
    return axiosClient.put(url, data)
  },
  deleteManageUnit: (id: string, str: string): Promise<Achievement> => {
    const url = `/achievement/deleteManageUnit/${id}`
    return axiosClient.post(url, { str })
  },
  delete: (id: string): Promise<Achievement> => {
    const url = '/achievement'
    return axiosClient.delete(`${url}/${id}`)
  },
  loginGoogle: (): Promise<any> => {
    const url = '/google'
    return axiosClient.get(url)
  },
  getResult: (
    id: number,
    filters: any
  ): Promise<{
    data: any[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/resultUser/${id}?${paramsString}`
    return axiosClient.get(url)
  },
  getStatus: (id: number): Promise<any> => {
    const url = `/achievement/status/${id}`
    return axiosClient.get(url)
  },
  setStatus: (status: string, id: number): Promise<any> => {
    const url = `/achievement/status/${id}`
    return axiosClient.put(url, { status })
  },
  getSummary: (
    id: number,
    filters: any
  ): Promise<{
    data: any[]
    countSubmission: number
    countDepartment: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/summary/${id}?${paramsString}`
    return axiosClient.get(url)
  },
  getUserSubmission: (
    id: number,
    filters: any
  ): Promise<{
    data: any[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/users/submission/${id}?${paramsString}`
    return axiosClient.get(url)
  },
  getUserSubmissionToExport: (
    id: number,
    filters: any
  ): Promise<{
    data: any[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/department/users/submission/${id}?${paramsString}`
    return axiosClient.get(url)
  },
  getUserSubmissionToExpertise: (
    id: number,
    filters: any
  ): Promise<{
    data: any[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/achievement/users/submission/auditor/${id}?${paramsString}`
    return axiosClient.get(url)
  },
  getStatistic: (achievementId: number): Promise<any> => {
    const url = `/achievement/${achievementId}/statistic`
    return axiosClient.get(url)
  },
  getStatisticDepartment: (achievementId: number, departmentId: number): Promise<any> => {
    const url = `/achievement/${achievementId}/${departmentId}/statistic`
    return axiosClient.get(url)
  },
}

export default achievementApi
