import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AchievementList from "../components/AchievementList";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";

import InputSearch from "../../../../common/InputFilterSearch";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import UserApi from "../../../../api/Achievement/userApi";

interface Filters {
  limit: number;
  page: number;
  search: string;
}

function ProfileManagePage() {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const [count, setCount] = useState(1);
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const fetchAchievementList = async () => {
      try {
        const { data, count } = await achievementApi.getAllWithFilter(
          filters,
          false
        );
        setAchievementList(data);
        setCount(count);
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error(error);
          history.push("/loi-truy-cap");
        }
      }
    };
    if ([roles.DEPARTMENT].includes(user.role)) {
      fetchAchievementList();
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [history, dispatch, filters, user.role, user.id]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  return (
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
                <CCol sm="3"></CCol>
                <CCol
                  sm="5"
                  className="d-flex justify-content-end align-items-center"
                >
                  <div>Số lượng/ trang:</div>
                  <CSelect
                    defaultValue={"10"}
                    style={{ width: "80px", float: "right", margin: "0 10px" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFilters({ ...filters, limit: +e.currentTarget.value })
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
                achievementList={achievementList}
                handleChangeSearch={handleChangeSearch}
              ></AchievementList>
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
  );
}

export default ProfileManagePage;
