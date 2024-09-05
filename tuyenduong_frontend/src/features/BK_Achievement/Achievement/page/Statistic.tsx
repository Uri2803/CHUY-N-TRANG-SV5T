import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDataTable,
  CTooltip,
} from "@coreui/react";
import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { useHistory } from "react-router-dom";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement, {
  StatisticAchievement,
} from "../../../../types/Achievement";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";
import UserApi from "../../../../api/Achievement/userApi";
import StackedBarChart, {StackedBarChartThreeField} from "../components/Chart";

const fields = [
  {
    key: "stt",
    label: "STT",
    _style: { textAlign: "center", width: "5%" },
  },
  {
    key: "name",
    label: "Tên đơn vị",
    _style: { width: "35%", textAlign: "center" },
  },
  {
    key: "no_all",
    label: "Hồ sơ đã nộp",
    _style: { textAlign: "center", width: "12%" },
  },
  {
    key: "no_confirmed",
    label: "Hồ sơ đã được duyệt",
    _style: { textAlign: "center", width: "12%" },
  },
  {
    key: "no_result_2",
    label: "Hồ sơ đạt loại A",
    _style: { textAlign: "center", width: "12%" },
  },
  {
    key: "no_result_1",
    label: "Hồ sơ đạt loại B",
    _style: { textAlign: "center", width: "12%" },
  },
  {
    key: "no_result_0",
    label: "Hồ sơ đạt loại C",
    _style: { textAlign: "center", width: "12%" },
  },
];

function StatisticAchievementPage(props: any) {
  const { id: achievementId } = props?.match?.params;
  const [data, setData] = useState<StatisticAchievement[]>([]);
  const [achievement, setAchievement] = useState<Achievement>({});
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAchievement(id: number) {
      const response = await achievementApi.get(id);
      setAchievement(response);
    }
    getAchievement(achievementId);
  }, [achievementId]);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const getInfoStatistic = async () => {
      try {
        const res = await achievementApi.getStatistic(achievementId);
        setData(
          res.map((item: any) => ({
            ...item,
          }))
        );
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error(error);
          history.push("/loi-truy-cap");
        }
      }
    };
    if ([roles.MANAGER].includes(user.role)) {
      getInfoStatistic();
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [history, dispatch, user.role, user.id, achievementId]);

  return (
    <CRow>
      {data && data.length > 0 ? (
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <CRow className="align-items-center">
                <CTooltip content={`Quay lại`}>
                  <CIcon
                    size="lg"
                    className="mx-2"
                    content={freeSet.cilArrowCircleLeft}
                    onClick={() => {
                      history.push("/danh-hieu");
                    }}
                  />
                </CTooltip>
                <strong>
                  THỐNG KÊ VỀ DANH HIỆU/ GIẢI THƯỞNG:{" "}
                  {achievement ? achievement.name?.toUpperCase() : ""}
                </strong>
              </CRow>
            </CCardHeader>
            <CRow>
              <CCol xs={12}></CCol>
              <CCol xs={12}></CCol>
            </CRow>
            <CCardBody>
              <CRow className="mb-5">
                <StackedBarChart
                  labels={data.map((item: any) => item.name)}
                  arr_confirmed={data.map((item: any) => item.no_confirmed)}
                  arr_unconfirmed={data.map((item: any) => item.no_unconfirmed)}
                />
              </CRow>
              <CRow className="mb-5">
                <StackedBarChartThreeField
                  labels={data.map((item: any) => item.name)}
                  arr_result_2={data.map((item: any) => item.no_result_2)}
                  arr_result_1={data.map((item: any) => item.no_result_1)}
                  arr_result_0={data.map((item: any) => item.no_result_0)}
                />
              </CRow>
              <CDataTable
                items={data}
                fields={fields}
                noItemsView={{
                  noResults: "Không có kết quả tìm kiếm",
                  noItems: "Không có dữ liệu",
                }}
                scopedSlots={{
                  stt: (item: any, index: number) => {
                    return (
                      <td className="align-middle text-center">{index + 1}</td>
                    );
                  },
                  name: (item: any) => {
                    return (
                      <td className="align-middle text-center">{item.name}</td>
                    );
                  },
                  no_all: (item: any) => {
                    return (
                      <td className="align-middle text-center">
                        {item.no_all}
                      </td>
                    );
                  },
                  no_confirmed: (item: any) => {
                    return (
                      <td className="align-middle text-center">
                        {item.no_confirmed}
                      </td>
                    );
                  },
                  no_result_2: (item: any) => {
                    return (
                      <td className="align-middle text-center">
                        {item.no_result_2}
                      </td>
                    );
                  },
                  no_result_1: (item: any) => {
                    return (
                      <td className="align-middle text-center">
                        {item.no_result_1}
                      </td>
                    );
                  },
                  no_result_0: (item: any) => {
                    return (
                      <td className="align-middle text-center">
                        {item.no_result_0}
                      </td>
                    );
                  },
                }}
              ></CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      ) : (
        <p>Không có số liệu</p>
      )}
    </CRow>
  );
}

export default StatisticAchievementPage;
