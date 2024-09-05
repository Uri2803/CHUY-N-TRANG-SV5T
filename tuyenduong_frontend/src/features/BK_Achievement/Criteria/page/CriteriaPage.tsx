import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";

import MainCrit from "../components/MainCrit";
import {
  fetchAll,
  tempAddCrit,
  saveState,
  deleteCrit,
  modifyCrit,
  updateSoft,
} from "../../../../redux/TieuChi";
import { Criteria } from "../../../../types/TieuChi";
import { RouteComponentProps } from "react-router-dom";
import SubCrit from "../components/SubCrit";
import { FormCriteria } from "../../../../components/Form/FormCriteria";
import { FormCriteriaUpdate } from "../../../../components/Form/FormCriteriaUpdate";
import Toaster from "../../../../common/toast";
import achievementApi from "../../../../api/Achievement/achievementApi";
import moment from "moment";
import { roles } from "../../../../common/roles";
import SelectAchievement from "../components/SelectAchievement";
import UserApi from "../../../../api/Achievement/userApi";

const defaultCrit: Criteria = {
  id: 999,
  name: "Default Crit",
  method: "binary",
  isCriteria: false,
  evidence: true,
  type: "hard",
  upperSign: "=",
  lowerSign: "=",
  soft: 0,
  upperPoint: 0,
  lowerPoint: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  children: [],
  note: "",
  content: "",
  valueListString: "",
};
interface TParam {
  id: string;
}

const CriteriaPage = ({ match }: RouteComponentProps<TParam>) => {
  const [popModify, setPopModify] = useState(false);
  const [modifyItem, setModifyItem] = useState(defaultCrit);
  const [pId, setPId] = useState<number | string>(0);
  const [cNumber, setCNumber] = useState(0);
  const [achievementNumOfSoft, setAchievementNumOfSoft] = useState("");
  const [typeObject, setTypeObject] = useState("ACHIEVEMENT");

  const [showAchievementSelect, setShowAchievementSelect] = useState(false);

  const [achNumError, setAchNumError] = useState("");
  const [submitable, setSubmitable] = useState(true);
  const [isToast, setIsToast] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector((state: RootState) => state.tieuchi.list);
  const currentUser = useSelector((state: RootState) => state.user);
  //deleted array
  const [deletedID, setDeletedID] = useState<string[]>([]);
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    if (roles.MANAGER.includes(currentUser.role)) {
      dispatch(fetchAll(match.params.id));
    } else {
      verifyLogin();
      if (currentUser.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [dispatch, match.params.id, currentUser.role, currentUser.id, history]);
  //Don't add data.length here
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getSoftAchievement(id: number) {
      try {
        const res = await achievementApi.get(id);
        setTypeObject(res.type || "ACHIEVEMENT");
        setAchievementNumOfSoft(res?.softCriteria?.toString() || "0");

        if (res) {
          if (res.softCriteria === data.length) {
            setNumSoftOption("all");
          }
        }
        const today = moment();
        const startDay = moment(res.startAt);
        setIsExpired(today.diff(startDay, "hours") > 0);
      } catch (error: any) {
        console.log(error?.message);
        history.push("/loi-truy-cap");
      }
    }
    if (roles.MANAGER.includes(currentUser.role)) {
      getSoftAchievement(parseInt(match.params.id));
    } else {
      verifyLogin();
      if (currentUser.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [
    dispatch,
    match.params.id,
    currentUser.role,
    currentUser.id,
    history,
    data.length,
  ]);

  const [numSoftOption, setNumSoftOption] = useState(
    parseInt(achievementNumOfSoft) === data.length ? "all" : "atleast"
  );

  const [popAdd, setPopAdd] = useState(false);

  const addBtnClicked = (id: number | string, LCNumber: number): void => {
    setPId(id);
    setCNumber(LCNumber);
    setPopAdd(true);
  };

  const handleSubmitForm = (values: any) => {
    dispatch(tempAddCrit(values));
  };

  const handleSubmitModForm = (values: any) => {
    dispatch(modifyCrit(values));
  };

  const deleteBtnClicked = (id: number | string): void => {
    setDeletedID([...deletedID, id.toString()]);
    dispatch(deleteCrit({ itemId: id }));
  };

  const modifyItemClicked = (item: Criteria, id: number | string) => {
    setPId(id);
    setModifyItem(item);
    setPopModify(true);
  };
  const onAddSuccess = (nopId: string, number: number) => {
    if (nopId !== "0") {
      const payload = {
        critId: pId,
        soft: number,
      };
      dispatch(updateSoft(payload));
    } else {
      if (numSoftOption === "all") {
        setAchievementNumOfSoft(
          (parseInt(achievementNumOfSoft) + 1).toString()
        );
      }
    }
  };
  const validate = (): boolean => {
    if (achievementNumOfSoft === "" || isNaN(achievementNumOfSoft as any)) {
      setAchNumError("Vui lòng nhập một số hợp lệ");
      return false;
    }
    return true;
  };
  const saveButtonClicked = () => {
    if (validate()) {
      const number =
        numSoftOption === "all" ? data.length : parseInt(achievementNumOfSoft);
      achievementApi.update(match.params.id, {
        softCriteria: number,
      });
      dispatch(saveState(match.params.id, deletedID));
      sessionStorage.clear();
      setAchNumError("");
      setIsToast(true);
    }
  };

  const cancelSubmission = () => {
    setSubmitable(false);
  };

  const activateSubmission = () => {
    setSubmitable(true);
  };
  return (
    <>
      {roles.MANAGER.includes(currentUser.role) && (
        <div>
          <CCard>
            <CCardHeader>
              <CContainer>
                <CRow>
                  <CCol className="px-0">
                    <strong>QUẢN LÝ TIÊU CHÍ</strong>
                  </CCol>
                </CRow>
              </CContainer>
            </CCardHeader>
            <CCardBody>
              <CContainer className="px-0">
                <CRow className="px-3 ml-3 py-1 d-flex align-items-center">
                  {data.length > 0 ? (
                    data.length === 1 ? (
                      <CCol xl="12 px-0">
                        Người nộp phải phù hợp với tất cả những điều sau đây
                      </CCol>
                    ) : (
                      <>
                        <CCol md="auto" className="px-0">
                          Người nộp phải phù hợp với
                        </CCol>
                        <CCol md="auto" className="px-3">
                          <select
                            value={numSoftOption}
                            placeholder={"placeholder"}
                            className="form-control"
                            onChange={(event) => {
                              setNumSoftOption(event.target.value);
                              if (event.target.value === "all") {
                                setAchievementNumOfSoft(data.length.toString());
                              }
                            }}
                          >
                            <option value="all">tất cả</option>
                            <option value="atleast">ít nhất</option>
                          </select>
                        </CCol>
                        {numSoftOption === "atleast" ? (
                          <>
                            <CCol md="1" className="px-0">
                              <input
                                className="form-control"
                                type="text"
                                value={achievementNumOfSoft}
                                onChange={(e) => {
                                  setAchievementNumOfSoft(e.target.value);
                                }}
                              />
                            </CCol>
                            <CCol md="auto" className="pl-3 pr-1">
                              trong
                            </CCol>
                          </>
                        ) : (
                          <></>
                        )}{" "}
                        <CCol md="auto" className="px-0">
                          những điều sau đây
                        </CCol>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </CRow>
                <CRow>
                  <CCol md="auto" className="px-4 ml-4">
                    <span style={{ color: "red" }}>{achNumError}</span>
                  </CCol>
                </CRow>
                {data.map((item) =>
                  item.isCriteria === false ? (
                    <MainCrit
                      key={item.id}
                      parentid={0}
                      item={item}
                      onAddClk={addBtnClicked}
                      onDelClk={deleteBtnClicked}
                      onModClk={modifyItemClicked}
                      cancelSubmit={cancelSubmission}
                      activateSubmit={activateSubmission}
                    />
                  ) : (
                    <SubCrit
                      key={item.id}
                      parentid={0}
                      item={item}
                      onDelClk={deleteBtnClicked}
                      onModClk={modifyItemClicked}
                    />
                  )
                )}
                <div className="main-crit-display-item flex-middle-vert-hori box-around">
                  {data.length > 0 ? (
                    <CButton
                      color="secondary"
                      onClick={saveButtonClicked}
                      disabled={!submitable || isExpired}
                    >
                      Lưu
                    </CButton>
                  ) : (
                    <></>
                  )}

                  <CButton
                    color="info"
                    onClick={() => addBtnClicked(0, 1)}
                    disabled={isExpired}
                  >
                    Thêm tiêu chí
                  </CButton>
                  {data.length === 0 ? (
                    <CButton
                      color="warning"
                      onClick={() => setShowAchievementSelect(true)}
                      disabled={isExpired}
                    >
                      Dùng bộ tiêu chí của...
                    </CButton>
                  ) : (
                    <></>
                  )}
                </div>
              </CContainer>
            </CCardBody>
          </CCard>

          <FormCriteria
            parentId={pId}
            onClose={() => setPopAdd(false)}
            onSubmit={handleSubmitForm}
            typeOb={typeObject}
            isOpen={popAdd}
            onAddSuccess={onAddSuccess}
            cNumber={cNumber}
          />
          {popModify ? (
            <FormCriteriaUpdate
              parentId={pId}
              onClose={() => setPopModify(false)}
              onSubmit={handleSubmitModForm}
              isOpen={popModify}
              item={modifyItem}
            />
          ) : (
            <></>
          )}
          {showAchievementSelect ? (
            <SelectAchievement
              handleClose={() => {
                setShowAchievementSelect(false);
              }}
              idAchievement={match.params.id}
            />
          ) : (
            <></>
          )}
          <Toaster isShow={isToast} />
        </div>
      )}
    </>
  );
};

export default CriteriaPage;
