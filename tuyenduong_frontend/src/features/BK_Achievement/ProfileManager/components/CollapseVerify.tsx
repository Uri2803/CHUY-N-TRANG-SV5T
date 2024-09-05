import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CTextarea,
} from "@coreui/react";
import React, { useState, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { MapInteractionCSS } from "react-map-interaction";
import { extname } from "path";
import { RootState } from "../../../../store";
import submissionApi from "../../../../api/Achievement/submissionApi";
import PdfViewer from "../../../../common/PdfPreview";

const well = {
  boxShadow: "0px 4px 4px 4px rgba(23,28,255,0.24)",
};

const styleHeader = {
  // backgroundColor: '#dbd9d9',
};

const Collapse = (props: any) => {
  const {
    typeOb,
    data,
    dataTotal,
    getChildren,
    examerId,
    disabled,
    isFinal,
    achievementId,
    seen,
  } = props;
  const [collapse, setCollapse] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const [stPdfFile, setStPdfFile] = useState<any>("");
  const [pdfShow, setPdfShow] = useState(false);
  const [isEvidence, setIsEvidence] = useState<boolean>(false);
  const [pathImage, setPathImage] = useState<string>("");

  const pdfViewClose = () => {
    setPdfShow(false);
    setStPdfFile("");
  };

  const handleCloseImage = () => setIsEvidence(false);

  const getEvidence = async () => {
    try {
      const fileResult = await submissionApi.downloadFile(
        examerId,
        achievementId,
        data.file
      );
      console.log(data.file)
      const fileExtName = extname(data.file);
      if (fileResult !== undefined) {
        if (data.file.match(/\.(jpg|jpeg|png)$/)) {
          const imageType = fileExtName in ["jpg", "jpeg"] ? "jpeg" : "png";
          const imageFile = new Blob([fileResult?.resultBlob], {
            type: `image/${imageType}`,
          });
          const fileURL = URL.createObjectURL(imageFile);
          setIsEvidence(true);
          setPathImage(fileURL);
        } else if (data.file.match(/\.(pdf)$/)) {
          const pdfFile = new Blob([fileResult?.resultBlob], {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(pdfFile);
          setStPdfFile(fileURL);
          setPdfShow(true);
        } else if (data.file.match(/\.(docx|doc)$/)) {
          const link = document.createElement("a");
          link.href = fileResult.resultUrl;
          link.setAttribute("download", data.file);
          document.body.appendChild(link);
          link.click();
        } else if (data.file.match(/\.(zip)$/)) {
          const link = document.createElement("a");
          link.href = fileResult.resultUrl;
          link.setAttribute("download", `${user.mssv}-preview.${fileExtName}`);
          document.body.appendChild(link);
          link.click();
        } else {
          setIsEvidence(true);
          setPathImage("");
        }
      } else {
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const showCollapse = useCallback(() => {
    setCollapse(!collapse);
  }, [collapse]);

  return (
    <>
      {data.isCriteria ? (
        <>
          <CCard style={well}>
            <CCardHeader color="light">{data.nameCriteria}</CCardHeader>
            <CCardBody>
              {data.content && (
                <>
                  <strong>Nội dung: </strong>
                  {data.content}
                  <br />
                </>
              )}
              {data.note && (
                <>
                  <strong> Ghi chú: </strong>
                  {data.note}
                  <br />
                </>
              )}

              <strong> Người đăng ký tự đánh giá: </strong>
              {data.method === "binary" ? (
                `${data.binary ? "Đạt" : "Không đạt"}`
              ) : data.method === "point" ? (
                <>
                  {data.point}
                  {typeOb === "COMPETITION" && (
                    <CTextarea disabled value={data.studentComment} />
                  )}
                </>
              ) : data.method === "comment" ? (
                <CTextarea disabled value={data.studentComment} />
              ) : (
                <CTextarea disabled value={data.studentSelect} />
              )}
              <br />
              {data.evidence && `(Yêu cầu nộp minh chứng)`}
            </CCardBody>
            {disabled ? undefined : (
              <>
                {data.evidence && data.file !== "" && (
                  <CCardFooter>
                    <CButton
                      color="secondary"
                      onClick={getEvidence}
                      className={"mb-1 mr-1 float-right"}
                    >
                      Xem minh chứng
                    </CButton>
                  </CCardFooter>
                )}
              </>
            )}
          </CCard>
          <CModal
            show={isEvidence}
            className="mt-5"
            size="xl"
            onClose={handleCloseImage}
            color="info"
          >
            <CModalHeader closeButton>
              <CModalTitle>Xem minh chứng</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {pathImage === "" ? (
                "Người dùng không nộp minh chứng"
              ) : (
                <MapInteractionCSS>
                  <img width={600} src={pathImage} alt="ảnh bị lỗi" />
                </MapInteractionCSS>
              )}
            </CModalBody>
          </CModal>
        </>
      ) : (
        <CCard>
          <CCardHeader
            color="secondary"
            className="headerCollapse"
            style={styleHeader}
            onClick={showCollapse}
          >
            {data.nameCriteria}
          </CCardHeader>
          <CCollapse show={collapse}>
            <CCardBody>
              {data.soft ? (
                <div className="mb-2">
                  Yêu cầu đạt <b>{data.soft}</b> trong các tiêu chí sau
                </div>
              ) : (
                <div className="mb-2">
                  Yêu cầu đạt được <b>tất cả</b> các tiêu chí
                </div>
              )}

              {getChildren(dataTotal, data).map((child: any) => (
                <Collapse
                  typeOb={typeOb}
                  key={child.id}
                  data={child}
                  isFinal={isFinal}
                  achievementId={achievementId}
                  examerId={examerId}
                  seen={seen}
                  dataTotal={dataTotal}
                  disabled={disabled}
                  getChildren={getChildren}
                />
              ))}
            </CCardBody>
          </CCollapse>
        </CCard>
      )}
      {pdfShow ? (
        <PdfViewer file={stPdfFile} show={true} pdfViewClose={pdfViewClose} />
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Collapse);
