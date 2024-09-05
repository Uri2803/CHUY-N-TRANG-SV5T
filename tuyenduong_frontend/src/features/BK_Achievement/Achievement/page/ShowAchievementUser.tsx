import React, { useEffect, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import moment from "moment";
import UserApi from "../../../../api/Achievement/userApi";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { roles } from "../../../../common/roles";

const well = {
  boxShadow: "0px 4px 4px 4px rgba(23,28,255,0.24)",
};

const ShowAchievementUser = () => {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const [result, setResult] = useState<any[]>([]);
  const history = useHistory();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    verifyLogin();
    if ([roles.PARTICIPANT].includes(user.role)) {
      Promise.all([achievementApi.getAll(), UserApi.resultAchievement()])
      .then((response) => {
        setAchievementList(response[0]);
        if (!Array.isArray(response[1])) history.push("/loi-truy-cap");
        else setResult(response[1]);
      })
      .catch((error) => {
        console.error(error);
        if (user.id !== 0) history.push("/loi-truy-cap");
      });
    } else {
      history.push("/loi-truy-cap");
    }
    
  }, [history, user.id, user.role]);

  const customAchievementList = achievementList.filter(
    (item) => moment().diff(moment(item.endSubmitAt), "seconds") < 0
  );

  return (
    <>
      <CRow>
        {customAchievementList.length === 0 && (
          <CCol
            sm="12"
            className="mt-5 d-flex flex-column justify-content-center align-items-center"
          >
            <CIcon
              style={{ width: "100px", height: "100px", marginBottom: "20px" }}
              content={freeSet.cilFindInPage}
            />
            <h3>Không có danh hiệu/giải thưởng trong giai đoạn tiến hành</h3>
            <div className="d-flex">
              <CIcon
                size="xl"
                className="mr-1"
                content={freeSet.cilHandPointRight}
              />
              bạn có thể xem{" "}
              <div
                style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
                onClick={() => history.push("/lich-su-de-cu")}
              >
                {" "}
                lịch sử đề cử{" "}
              </div>
            </div>
          </CCol>
        )}
        {customAchievementList.map((item) => (
          <CCol xl="6" key={item.id}>
            <CCard className="card-style" style={well}>
              <CCardHeader color="light">
                <CRow>
                  <CCol md="auto" className="pb-2">
                    <strong> {item.name?.toLocaleUpperCase()}</strong>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CRow className="pb-2">
                  <CCol md="auto" className="pt-0">
                    Tình trạng:
                  </CCol>
                  <CCol md="auto" className="pb-0">
                    {result?.filter((res) => res.id === item.id).length > 0 ? (
                      result
                        .filter((res) => res.id === item.id)
                        .map((res) => {
                          if (res.id === item.id) {
                            if (!res.isResult) {
                              return (
                                <h4 key={res.id}>
                                  <div className="card-header-actions">
                                    <CBadge
                                      color="info"
                                      className="float-right"
                                    >
                                      Đã nộp
                                    </CBadge>
                                  </div>
                                </h4>
                              );
                            } else {
                              return res.result ? (
                                <h4 key={res.id}>
                                  <div className="card-header-actions">
                                    <CBadge
                                      color="success"
                                      className="float-right"
                                    >
                                      Được xác nhận đạt
                                    </CBadge>
                                  </div>
                                </h4>
                              ) : (
                                <h4 key={res.id}>
                                  <div className="card-header-actions">
                                    <CBadge
                                      color="warning"
                                      className="float-right"
                                    >
                                      Được xác nhận không đạt
                                    </CBadge>
                                  </div>
                                </h4>
                              );
                            }
                          } else {
                            return <></>;
                          }
                        })
                    ) : moment().diff(moment(item.startAt), "hours") < 0 ? (
                      <h4>
                        <div className="card-header-actions">
                          <CBadge color="secondary" className="float-right">
                            Chưa mở nhận hồ sơ
                          </CBadge>
                        </div>
                      </h4>
                    ) : (
                      <h4>
                        <div className="card-header-actions">
                          <CBadge color="info" className="float-right">
                            Đang nhận hồ sơ
                          </CBadge>
                        </div>
                      </h4>
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl="9" className="d-flex align-items-center">
                    <strong className="mr-1">Thời gian nhận hồ sơ: </strong>
                    {moment(item.startAt).format("DD/MM/YYYY")} -{" "}
                    {moment(item.endSubmitAt).format("DD/MM/YYYY")}
                  </CCol>
                  <CCol xl="3" className="d-flex justify-content-end">
                    <div className="card-header-actions">
                      <CButton
                        color="info"
                        shape="rounded-pill"
                        size="sm"
                        onClick={() => history.push(`/de-cu/${item.id}`)}
                      >
                        {moment().diff(moment(item.startAt), "hours") < 0
                          ? "Chi tiết"
                          : moment().diff(moment(item.endSubmitAt), "hours") > 0
                          ? "Xem lại"
                          : "Nộp hồ sơ"}
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
};

export default ShowAchievementUser;
