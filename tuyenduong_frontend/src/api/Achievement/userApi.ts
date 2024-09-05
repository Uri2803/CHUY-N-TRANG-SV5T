import queryString from "query-string";
import User from "../../types/User";
import UserInfo from "../../types/UserInfo";
import axiosClient from "../axiosClient";

interface DepData {
  department: any;
  youthUnion: any;
}
const UserApi = {
  loginGoogle: (token: string): Promise<any> => {
    const url = '/google-authentication'
    return axiosClient.post(url, { token })
  },
  updateUser: (user: any, info: any): Promise<any> => {
    const url = '/user/updateUser'
    return axiosClient.put(url, { user: user, info: info })
  },
  getUserInfo: (id: string): Promise<UserInfo> => {
    const url = `/user/contact-info/${id}`
    return axiosClient.get(url)
  },
  getUserDepartmentAndYouthUnion: (id: string): Promise<DepData> => {
    const url = `/user/userDY/${id}`
    return axiosClient.get(url)
  },
  logout: (): Promise<any> => {
    const url = '/user/logout'
    return axiosClient.post(url)
  },
  resultAchievement: (): Promise<any> => {
    const url = '/user/result-achievement'
    return axiosClient.get(url)
  },
  getInfoToken: (token: string): Promise<User> => {
    const url = '/user/info'
    return axiosClient.post(url, { token })
  },
  getAll: (filters = {}): Promise<User[]> => {
    const params = queryString.stringify(filters)
    const url = `/user?${params}`
    return axiosClient.get(url)
  },
  getFilter: (filters: any): Promise<{ data: User[]; count: number }> => {
    const params = queryString.stringify(filters)
    const url = `/user/filter?${params}`
    return axiosClient.get(url)
  },
  getFilterAllUser: (
    filters: any
  ): Promise<{ data: User[]; count: number }> => {
    const params = queryString.stringify(filters)
    const url = `/user/filterAll?${params}`
    return axiosClient.get(url)
  },
  getFilterMemberUnit: (
    filters: any,
    achievementId : string,
    codeDepartment: string,
  ): Promise<{ data: User[]; count: number }> => {
    const params = queryString.stringify(filters)
    const url = `/user/filterMemberUnit/${codeDepartment}/${achievementId}?${params}`
    return axiosClient.get(url)
  },
  get: (id: number): Promise<any> => {
    const url = `/user/${id}`
    return axiosClient.get(url)
  },

  getMssv: (mssv :string): Promise<User> => {
    const url = `/user/mssv/${mssv}`
    return axiosClient.get(url)
  },

  create: (data: any): Promise<User> => {
    const url = '/user'
    return axiosClient.post(url, data)
  },
  createUserForDepartment: (data: any): Promise<any> => {
    const url = '/user/department'
    return axiosClient.post(url, data)
  },
  refreshToken: () => {
    const url = '/user/refresh'
    return axiosClient.get(url)
  },
  verifyLogin: () => {
    const url = '/user/verifyLoginUser'
    return axiosClient.get(url)
  },
  updateInfoManager: (id: number, body: any): Promise<User> => {
    const url = `user/${id}`
    return axiosClient.put(url, body)
  },
  allowUpdateInfo: (id: number): Promise<User> => {
    const url = `user/allowUpdate/${id}`
    return axiosClient.put(url)
  },
  delete: (id: number): Promise<any> => {
    const url = `user/${id}`
    return axiosClient.delete(url)
  },
}

export default UserApi;
