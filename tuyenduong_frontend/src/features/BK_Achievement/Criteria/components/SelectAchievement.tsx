import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTooltip,
  CSelect,
  CPagination,
  CModal,
} from "@coreui/react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import achievementApi from "../../../../api/Achievement/achievementApi";
import InputSearch from "../../../../common/InputFilterSearch";
import { roles } from "../../../../common/roles";
import { RootState } from "../../../../store";
import Achievement from "../../../../types/Achievement";

import AchievementList from "./AchievementList";

interface Filters {
  limit: number;
  page: number;
  search: string;
}

const SelectAchievement = (prop: { idAchievement: string, handleClose: () => void }) => {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const [count, setCount] = useState(1);
  useEffect(() => {
    const fetchAchievementList = async () => {
      try {
        const { data, count } = await achievementApi.getAllWithFilter(
          filters,
          false,
          'ACHIEVEMENT',
          prop.idAchievement
        );
        setAchievementList(data);
        setCount(count);
      } catch (error: any) {
        if (error.response.status !== 401) {
          console.error(error);
          history.push("/loi-truy-cap");
        }
      }
    };
    if ([roles.MANAGER, roles.PARTICIPANT].includes(user.role)) {
      fetchAchievementList();
    } else {
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [history, filters, user.role, user.id, prop.idAchievement]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };
  return (
    <CModal show={true} onClose={prop.handleClose}>
      <CRow>
        <>
          {" "}
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                <strong>DANH SÁCH CÁC DANH HIỆU</strong>
              </CCardHeader>
              <CRow>
                <CCol xs={12}></CCol>
                <CCol xs={12}></CCol>
              </CRow>
              <CCardBody>
                <CRow className="mb-2">
                  <CCol sm="4" className="d-flex align-items-center">
                    <CTooltip content={`Tên danh hiệu/giải thưởng`}>
                      <CIcon
                        className="mr-1"
                        size="lg"
                        content={freeSet.cilFilter}
                      />
                    </CTooltip>
                    <InputSearch onSubmit={handleChangeSearch} />
                  </CCol>
                  <CCol sm="2"></CCol>
                  <CCol
                    sm="6"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <div>Số lượng/ trang:</div>
                    <CSelect
                      defaultValue={"10"}
                      style={{
                        width: "80px",
                        float: "right",
                        margin: "0 10px",
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFilters({
                          ...filters,
                          limit: +e.currentTarget.value,
                        })
                      }
                    >
                      <option value="5">5</option>
                      <option value="10" selected>
                        10
                      </option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </CSelect>
                  </CCol>
                  <CCol sm="4"></CCol>
                </CRow>

                <AchievementList
                  data={achievementList}
                  closeList={prop.handleClose}
                />
                <div className={"mt-2 d-flex justify-content-center"}>
                  <CPagination
                    activePage={filters.page}
                    className="align-middle text-center"
                    pages={Math.ceil(count / filters.limit)}
                    onActivePageChange={(i: number) =>
                      setFilters({ ...filters, page: i })
                    }
                  ></CPagination>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </>
      </CRow>
    </CModal>
  );
};

export default SelectAchievement;
