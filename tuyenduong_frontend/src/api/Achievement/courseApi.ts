import Course from "../../types/Course";
import axiosClient from "../axiosClient";

const courseApi = {
  getAll: (): Promise<Course[]> => {
    const url = "/course/list";
    return axiosClient.get(url);
  },
};

export default courseApi;
