import {
  CButton,
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
import CourseList from "../components/AchievementList";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import { AchievementAdd } from "../components/AchievementAdd";
import { AchievementEdit } from "../components/AchievementEdit";
import { AchievementDelete } from "../components/AchievementDelete";
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

function CoursePage() {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const [achievement, setAchievement] = useState<Achievement>({
    id: 0,
    name: "",
    description: "",
    startAt: new Date(),
    endAt: new Date(),
    endSubmitAt: new Date(),
  });
  const [isModalAdd, setIsModalAdd] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const countAchievement = useSelector(
    (state: RootState) => state.achievementSideBar
  );
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
    const fetchAchievementList = async (auditor: boolean) => {
      try {
        const { data, count } = await achievementApi.getAllWithFilter(
          filters,
          auditor
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
    if (
      [roles.MANAGER, roles.PARTICIPANT, roles.DEPARTMENT].includes(user.role)
    ) {
      fetchAchievementList(false);
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [history, dispatch, filters, user.role, user.id, countAchievement]);

  const handleCourseUpdate = (item: Achievement) => {
    setIsModalEdit(true);
    setAchievement(item);
  };

  const handleCourseDelete = (item: Achievement) => {
    setIsModalDelete(true);
    setAchievement(item);
  };

  const handleAdd = (item: Achievement) => {
    setAchievementList([item, ...achievementList]);
    setIsModalAdd(false);
  };
  const handleEdit = (oldId: number, newAchievement: Achievement) => {
    const index = achievementList.findIndex((item) => item.id === oldId);
    setAchievementList([
      ...achievementList.slice(0, index),
      newAchievement,
      ...achievementList.slice(index + 1),
    ]);
    setIsModalEdit(false);
  };
  const handleDelete = (id: number) => {
    const achievements = achievementList.filter((item) => item.id !== id);
    setAchievementList([...achievements]);
    setIsModalDelete(false);
  };

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
                  {["admin", "manager"].includes(user.role) && (
                    <CButton
                      color="info"
                      size=""
                      onClick={() => setIsModalAdd(true)}
                      className="align-middle justify-content-center"
                    >
                      Thêm danh hiệu
                    </CButton>
                  )}
                </CCol>
                <CCol sm="4"></CCol>
              </CRow>

              <CourseList
                achievementList={achievementList}
                handleCourseUpdate={handleCourseUpdate}
                handleCourseDelete={handleCourseDelete}
                handleChangeSearch={handleChangeSearch}
              ></CourseList>
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
        {roles.MANAGER.includes(user.role) && (
          <>
            <AchievementEdit
              item={achievement}
              isOpen={isModalEdit}
              btnSubmit="Sửa"
              colorBtnSubmit="info"
              handleClose={() => setIsModalEdit(false)}
              title="Chỉnh sửa Danh Hiệu"
              handleSubmit={handleEdit}
            />
            <AchievementDelete
              item={achievement}
              isOpen={isModalDelete}
              btnSubmit="Xóa"
              colorBtnSubmit="danger"
              handleClose={() => setIsModalDelete(false)}
              title="Xóa Danh Hiệu"
              handleSubmit={handleDelete}
            />
            <AchievementAdd
              isOpen={isModalAdd}
              btnSubmit="Thêm"
              colorBtnSubmit="info"
              handleClose={() => setIsModalAdd(false)}
              title="Thêm Danh Hiệu"
              handleSubmit={handleAdd}
            />
          </>
        )}
      </>
    </CRow>
  );
}

export default CoursePage;
