import axiosClient from '../axiosClient'
import queryString from 'query-string'

const AuditorApi = {
  createResultOfCriteria: (
    data: any = [],
    achievement: number,
    resultFinal: number,
    examer: number
  ): Promise<string> => {
    const url = `/auditor/${achievement}/${examer}`
    return axiosClient.post(url, { resultFinal, data })
  },
  getSubmissionExamers: (
    achievement: number,
    userId: number,
    users: number[]
  ): Promise<any> => {
    const paramsString = users.length !== 0 ? users.toString() : '-999'
    const url = `/auditor/${achievement}/${userId}?listUser=${paramsString}`
    return axiosClient.get(url)
  },
  getSubmissionExamersFinal: (
    achievement: number,
    userId: number,
    users: number[]
  ): Promise<any> => {
    const paramsString = users.length !== 0 ? users.toString() : '-999'
    const url = `/auditor/final/${achievement}/${userId}?listUser=${paramsString}`
    return axiosClient.get(url)
  },
  getSubmissionExamersToExport: (
    achievement: number,
    userId: number,
    users: number[]
  ): Promise<any> => {
    const paramsString = users.length !== 0 ? users.toString() : '-999'
    const url = `/auditor/department/${achievement}/${userId}?listUser=${paramsString}`
    return axiosClient.get(url)
  },
  getResultSubmission: (submission: string): Promise<any> => {
    const url = `/auditor/${submission}`
    return axiosClient.get(url)
  },
  getResult: (achievement: number, examer: number): Promise<any> => {
    const url = `/submission/result/${achievement}/${examer}`
    return axiosClient.get(url)
  },
  getResultToRefer: (achievement: number, auditorFinal: number, examer: number): Promise<any> => {
    const url = `/auditor/auditorfinal/${achievement}/${auditorFinal}?listUser=${examer}`
    return axiosClient.get(url)
  },
  getUsers: (achievement: number,auditor : number = -999, filters: any): Promise<any> => {
    const paramsString = queryString.stringify(filters)
    const url = `/submission/${achievement}/${auditor}?${paramsString}`
    return axiosClient.get(url)
  },
  getUsersFinal: (achievement: number,auditor : number = -999, filters: any): Promise<any> => {
    const paramsString = queryString.stringify(filters)
    const url = `/submission/final/${achievement}/${auditor}?${paramsString}`
    return axiosClient.get(url)
  },
  getUsersDepartment: (achievement: number,auditor : number = -999, filters: any): Promise<any> => {
    const paramsString = queryString.stringify(filters)
    const url = `/submission/department/${achievement}/${auditor}?${paramsString}`
    return axiosClient.get(url)
  },
  getAuditorsForAchievement: (achievementId: number): Promise<any> => {
    const url = `/achievement/auditor/${achievementId}`
    return axiosClient.get(url)
  },
  updateAuditorsForAchievement: (
    achievementId: number,
    data: any
  ): Promise<any> => {
    const url = `/achievement/auditor/${achievementId}`
    return axiosClient.put(url, data)
  },
}

export default AuditorApi
