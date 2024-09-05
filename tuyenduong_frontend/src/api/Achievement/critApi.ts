import { Criteria } from "../../types//TieuChi";
import axiosClient from "../axiosClient";

const critApi = {
  getAll: (id: string): Promise<Criteria[]> => {
    const url = `/criteria/department/${id}`;
    return axiosClient.get(url);
  },
  add: (id: string, item: any): Promise<Criteria> => {
    const url = `/criteria/department/${id}`;
    return axiosClient.post(url, item);
  },
  update: (id: string, item: Criteria): Promise<Criteria> => {
    const url = `/criteria/${id}`;
    return axiosClient.put(url, item);
  },
  delete: (id: string): Promise<Criteria> => {
    const url = `/criteria/${id}`;
    return axiosClient.delete(url);
  },
};

export default critApi;
