import { Submission } from "../../types/Submission";
import axiosClient from "../axiosClient";

interface SvRes {
  done: any;
  value: any;
}

const submissionApi = {
  getAll: (acvId: string, userId: string): Promise<any> => {
    const url = `/submission/participant-get/${acvId}/${userId}`;
    return axiosClient.get(url);
  },
  add: (
    acvId: string,
    userId: string,
    data: Submission[]
  ): Promise<Submission[]> => {
    const url = `/submission/${acvId}/${userId}`;
    return axiosClient.post(url, data);
  },
  uploadFiles: (data: File): Promise<Submission[]> => {
    const url = `/submission/upload`;
    return axiosClient.post(url, data);
  },
  compareEvidence: (
    userId: number,
    acvId: string,
    fileName: string,
    selfComment: string
  ): Promise<string> => {
    const url = `/submission/${userId}/${acvId}/${fileName}/compare`;
    return axiosClient.post(url, {text: selfComment});
  },
  downloadFile: (userId: number, acvId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      const resultURL = fetch(
        `${process.env.REACT_APP_API_SERVER}/submission/download/${userId}/${acvId}/${fileName}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authentication: token !== null ? token : "",
          },
        }
      )
        .then((response: any) => {
          const reader = response.body.getReader();

          return new ReadableStream({
            start(controller) {
              return pump();
              function pump() {
                return reader.read().then(({ done, value }: SvRes) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            },
          });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);

          return { resultUrl: url, resultBlob: blob };
        });
      return resultURL;
    } catch (err: any) {
      console.log(err.message);
    }
  },
  confirm: (
    data: {
      id: number;
    },
    idAchievement: number
  ): Promise<any> => {
    const url = `/submission/achievements/${idAchievement}/verified-user`;
    return axiosClient.post(url, data);
  },
  unConfirm: (
    data: {
      id: number;
    },
    idAchievement: number
  ): Promise<any> => {
    const url = `/submission/achievements/${idAchievement}/verified-user`;
    return axiosClient.put(url, data);
  },
};

export default submissionApi;
