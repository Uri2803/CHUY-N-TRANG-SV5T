import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { fetchAll } from "../../../../redux/TieuChi";
import {
  genSubmission,
  fetchAll as fetchAllSubmission,
  addSubmissionAsync,
} from "../../../../redux/submission";

import { RouteComponentProps, useHistory } from "react-router-dom";

import { Criteria } from "../../../../types/TieuChi";
import { GenerateApplicationHandler } from "../../../../utils/critArrayHandler";
import Toaster from "../../../../common/toast";
import FileData from "../../../../types/FileData";
import submissionApi from "../../../../api/Achievement/submissionApi";
import { extname } from "path";
import MainSubmission from "../components/MainSubmission";
import NotUpdatedInfoErr from "../../../../common/toast/NotUpdatedInfoErr";
import achievementApi from "../../../../api/Achievement/achievementApi";
import moment from "moment";
import { roles } from "../../../../common/roles";
import PdfViewer from "../../../../common/PdfPreview";
import ImageViewer from "../../../../common/ImagePreview";
import NotSupportedViewer from "../../../../common/NotSupportFileType";
import UserApi from "../../../../api/Achievement/userApi";
import NotHcmutNotSubmit from "../../../../common/toast/NotHcmutNotSubmit";
import Spinner from "../../../../common/Spinner";

type TParams = { id: string };
const SubmissionPage = ({ match }: RouteComponentProps<TParams>) => {
  const [submittable, setSubmitable] = useState(true);

  const [isToast, setIsToast] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const data = useSelector((state: RootState) => state.tieuchi.list);
  const submitData = useSelector((state: RootState) => state.submission.list);
  const [fileToSave, setFileToSave] = useState<FileData[]>([]);

  const [isNotUpdatedInfo, setIsNotUpdatedInfo] = useState(false);

  const [isExpired, setIsExpired] = useState(false);
  const [isSoon, setIsSoon] = useState(false);
  const [typeObject, setTypeObject] = useState("ACHIEVEMENT");

  const [stPdfFile, setStPdfFile] = useState<any>("");
  const [pdfShow, setPdfShow] = useState(false);

  const [stImgFile, setStImgFile] = useState<any>("");
  const [imgShow, setImgShow] = useState(false);
  // eslint-disable-next-line
  const [notBkNetID, setNotBkNetID] = useState(false);

  const [fileNotSupported, setFileNotSupported] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const loadCriteria = () => {
      try {
        dispatch(fetchAll(match.params.id));
      } catch (error: any) {
        console.log(error?.message);
        history.push("/loi-truy-cap");
      }
    };
    const loadAllSubmission = () => {
      try {
        dispatch(fetchAllSubmission(match.params.id, user.id.toString()));
      } catch (error: any) {
        console.log(error?.message);
        history.push("/loi-truy-cap");
      }
    };
    const checkExpired = async () => {
      try {
        const res = await achievementApi.get(parseInt(match.params.id));

        setTypeObject(res.type || "ACHIEVEMENT");
        const today = moment();
        const endDay = moment(res.endAt);
        const startDay = moment(res.startAt);
        setIsExpired(today.diff(endDay, "hours") > 0);
        setIsSoon(today.diff(startDay, "hours") < 0);
      } catch (error: any) {
        console.log(error?.message);
        history.push("/loi-truy-cap");
      }
    };

    if ([roles.PARTICIPANT].includes(user.role)) {
      if (user.id !== 0) {
        checkExpired();
        loadCriteria();
        loadAllSubmission();
      } else {
        history.push("/loi-truy-cap");
      }
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [dispatch, match.params.id, user.id, history, user.role]); //should not change anything

  const cancelSubmit = () => {
    setSubmitable(false);
  };

  const activateSubmit = () => {
    setSubmitable(true);
  };

  const onAddFileToSave = (file: FileData) => {
    for (let sendfile of fileToSave) {
      const sendFileCode = sendfile.fileName.split(".")[0];
      const fileCode = file.fileName.split(".")[0];

      if (sendFileCode === fileCode) {
        setFileToSave([
          ...fileToSave.filter(
            (item) =>
              item.fileName.split(".")[0] !== file.fileName.split(".")[0]
          ),
          file,
        ]);

        return;
      }
    }
    setFileToSave([...fileToSave, file]);
  };
  const saveButtonClicked = async () => {
    setShowSpinner(true);
    if (fileToSave.length > 0) {
      const formData = new FormData();
      for (let sendfile of fileToSave) {
        formData.append("file", sendfile.file, sendfile.fileName);
      }
      try {
        const token = localStorage.getItem("token");
        await fetch(
          `${process.env.REACT_APP_API_SERVER}/submission/uploadfiles/${user.id}/${match.params.id}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              Authentication: token !== null ? token : "",
            },
          }
        );
      } catch (err: any) {
        console.log(err.message);
      }
    }
    dispatch(
      addSubmissionAsync(match.params.id, user.id.toString(), submitData)
    );
    setShowSpinner(false);

    setIsToast(true);
    setTimeout(() => {
      history.push("/de-cu");
    }, 2500);
  };

  const ApplicationGen = (arr: Criteria[], userId: number, achId: number) => {
    if (user.isUpdatedInformation) {
      const newData = GenerateApplicationHandler(arr, userId, achId);
      dispatch(genSubmission({ list: newData }));
    } else {
      setIsNotUpdatedInfo(true);
      setTimeout(() => {
        history.push("/thong-tin");
      }, 4000);
    }
  };

  const onShowClicked = async (fileName: string) => {
    try {
      const fileResult = await submissionApi.downloadFile(
        user.id,
        match.params.id,
        fileName
      );

      const fileExtName = extname(fileName);
      if (fileResult !== undefined) {
        if (fileName.match(/\.(jpg|jpeg|png)$/)) {
          const imageType = fileExtName in ["jpg", "jpeg"] ? "jpeg" : "png";
          const imageFile = new Blob([fileResult?.resultBlob], {
            type: `image/${imageType}`,
          });
          const fileURL = URL.createObjectURL(imageFile);
          setStImgFile(fileURL);
          setImgShow(true);
        } else if (fileName.match(/\.(pdf)$/)) {
          const pdfFile = new Blob([fileResult?.resultBlob], {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(pdfFile);

          setStPdfFile(fileURL);
          setPdfShow(true);
        } else if (fileName.match(/\.(docx|doc)$/)) {
          const link = document.createElement("a");
          link.href = fileResult.resultUrl;
          link.setAttribute("download", `${user.mssv}-preview.${fileExtName}`);
          document.body.appendChild(link);
          link.click();
        } else if (fileName.match(/\.(zip)$/)) {
          const link = document.createElement("a");
          link.href = fileResult.resultUrl;
          link.setAttribute("download", `${user.mssv}-preview.${fileExtName}`);
          document.body.appendChild(link);
          link.click();
        }
      } else {
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };
  const onPreviewClicked = async (fileName: string) => {
    const fileExtName = extname(fileName);
    const file = fileToSave.filter((item) => item.fileName === fileName);
    if (file.length > 0) {
      if (fileName.match(/\.(jpg|jpeg|png)$/)) {
        const imageType = fileExtName in ["jpg", "jpeg"] ? "jpeg" : "png";
        const imageFile = new Blob([file[0].file], {
          type: `image/${imageType}`,
        });
        const fileURL = URL.createObjectURL(imageFile);
        setStImgFile(fileURL);
        setImgShow(true);
      } else if (fileName.match(/\.(pdf)$/)) {
        const pdfFile = new Blob([file[0].file], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(pdfFile);

        setStPdfFile(fileURL);
        setPdfShow(true);
      } else if (fileName.match(/\.(docx|doc)$/)) {
        setFileNotSupported(true);
      } else if (fileName.match(/\.(zip)$/)) {
        setFileNotSupported(true);
      }
    }
  };
  const pdfViewClose = () => {
    setPdfShow(false);
    setStPdfFile("");
  };
  const imgViewClose = () => {
    setImgShow(false);
    setStImgFile("");
  };
  const notSpPopUpClose = () => {
    setFileNotSupported(false);
  };

  return (
    <CCard>
      <CCardHeader>
        <CContainer>
          <CRow className="align-items-center">
              <CTooltip content={`Quay lại`}>
                <CIcon
                  size="lg"
                  className="mx-2"
                  content={freeSet.cilArrowCircleLeft}
                  onClick={() => {
                    history.push("/de-cu");
                  }}
                />
              </CTooltip>
              <strong>ĐỀ CỬ </strong>
          </CRow>
        </CContainer>
      </CCardHeader>
      <CCardBody>
        <CTabs activeTab={data.length > 0 ? data[0].id : ""}>
          <CRow>
            <CCol xl="3" className="px-3">
              <CNav variant="pills" className="flex-column" role="tablist">
                {data.map((item) => {
                  return (
                    <CNavItem style={{ textAlign: "center" }}>
                      <CNavLink data-tab={item.id}>{item.name}</CNavLink>
                    </CNavItem>
                  );
                })}
                {!(submitData.length > 0) && !isExpired && !isSoon ? (
                  <CNavItem
                    style={{
                      boxSizing: "border-box",
                    }}
                  >
                    <CButton
                      color="info"
                      onClick={() => {
                        ApplicationGen(data, user.id, +match.params.id);
                      }}
                      style={{
                        boxSizing: "border-box",
                        height: "100%",
                        width: "100%",
                        borderRadius: "0",
                      }}
                    >
                      Tạo bộ hồ sơ
                    </CButton>
                  </CNavItem>
                ) : (
                  <></>
                )}

                {submitData.length > 0 && !isExpired && !isSoon ? (
                  <CNavItem
                    style={{
                      boxSizing: "border-box",
                    }}
                  >
                    <CButton
                      color="warning"
                      onClick={saveButtonClicked}
                      disabled={!submittable || isExpired || isSoon}
                      style={{
                        boxSizing: "border-box",
                        height: "100%",
                        width: "100%",
                        borderRadius: "0",
                      }}
                    >
                      Lưu
                    </CButton>
                  </CNavItem>
                ) : submitData.length > 0 ? (
                  <> </>
                ) : (
                  <></>
                )}
              </CNav>
            </CCol>
            <CCol xl="9">
              <CTabContent>
                {data.map((item) => {
                  return (
                    <CTabPane data-tab={item.id}>
                      <MainSubmission
                        typeOb={typeObject}
                        mainCrit={item}
                        submitData={submitData}
                        onAddFileToSave={onAddFileToSave}
                        cancelSubmit={cancelSubmit}
                        activateSubmit={activateSubmit}
                        onShowClicked={onShowClicked}
                        onPreviewClk={onPreviewClicked}
                      />
                    </CTabPane>
                  );
                })}
              </CTabContent>
            </CCol>
          </CRow>
          <Toaster isShow={isToast} />
          <NotUpdatedInfoErr isShow={isNotUpdatedInfo} />
          <NotHcmutNotSubmit isShow={notBkNetID} />
        </CTabs>
      </CCardBody>
      {pdfShow ? (
        <PdfViewer file={stPdfFile} show={true} pdfViewClose={pdfViewClose} />
      ) : (
        <></>
      )}
      {imgShow ? (
        <ImageViewer file={stImgFile} show={true} imgViewClose={imgViewClose} />
      ) : (
        <></>
      )}
      {fileNotSupported ? (
        <NotSupportedViewer show={true} notSpClose={notSpPopUpClose} />
      ) : (
        <></>
      )}
      {showSpinner ? <Spinner /> : <></>}
    </CCard>
  );
};

export default SubmissionPage;
