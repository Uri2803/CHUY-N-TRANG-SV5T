import queryString from 'query-string'
import Department from '../../types/Department'
import axiosClient from '../axiosClient'
const DepartmentApi = {
  get: async (
    filters: any
  ): Promise<{
    data: Department[]
    count: number
  }> => {
    const paramsString = queryString.stringify(filters)
    const url = `/department?${paramsString}`
    return axiosClient.get(url)
  },
  getAll: async (): Promise<Department[]> => {
    const url = '/department'
    return axiosClient.get(url)
  },
  createAll: async (data: Department[]): Promise<Department[]> => {
    const url = '/department'
    return axiosClient.post(url, data)
  },
  createDepartmentList: async (data: []): Promise<any[]> => {
    const formatData = data.map((data) => ({ code: data[0], name: data[1] }))
    const url = '/department/list'
    return axiosClient.post(url, formatData)
  },
  createYouthBranchList: async (data: []): Promise<any[]> => {
    const formatData = data.map((data) => ({ code: data[0], name: data[1] }))
    const url = '/department/youthRanch/list'
    return axiosClient.post(url, formatData)
  },
  createDepartment: async (data: {
    code: string
    name: string
  }): Promise<Department> => {
    const url = '/department'
    return axiosClient.post(url, data)
  },
  updateDepartment: async (
    id: number,
    data: {
      code: string
      name: string
    }
  ): Promise<Department> => {
    const url = `/department/${id}`
    return axiosClient.put(url, data)
  },
  createYouthBranch: async (
    code: string,
    data: { name: string }
  ): Promise<any> => {
    const url = `/department/youthRanch/${code}`
    return axiosClient.post(url, data)
  },
}
export default DepartmentApi
