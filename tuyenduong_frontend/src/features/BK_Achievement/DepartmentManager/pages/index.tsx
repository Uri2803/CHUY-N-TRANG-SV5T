import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from "@coreui/react";
import "moment/locale/vi";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { roles } from "../../../../common/roles";
import { FormAddDepartment } from "../components/FormAddDepartment";
import { FormDeleteDepartment } from "../components/FormDeleteDepartment";
import DepartmentApi from "../../../../api/Achievement/departmentApi";
import InputSearch from "../../../../common/InputFilterSearch";
import SheetApp from "../../../../common/SheetApp/";
import Spinner from "../../../../common/Spinner";
import { setSpinner } from "../../../../redux/spinner";
import { setTimeout } from "timers";
import UserApi from "../../../../api/Achievement/userApi";

const fields = [
  {
    key: "stt",
    label: "STT",
    _style: { width: "5%", textAlign: "center" },
  },
  {
    key: "code",
    label: "Mã đơn vị",
    _style: { width: "15%", textAlign: "center" },
  },
  {
    key: "name",
    label: "Tên đơn vị",
    sorter: false,
    filter: false,
    _style: { width: "60%", textAlign: "center" },
  },
  {
    key: "action",
    label: "Thao tác",
    _style: { width: "20%", textAlign: "center" },
    sorter: false,
    filter: false,
  },
];

interface Filters {
  limit: number;
  page: number;
  search: string;
}

function Department(props: any) {
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const isSpinner = useSelector((state: RootState) => state.spinner);
  const [modalDelete, setModalDelete] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    isAdd: true,
    value: {
      id: 0,
      code: "",
      name: "",
    },
  });
  const [count, setCount] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getDepartmentAndYouthBranch() {
      try {
        const { data, count } = await DepartmentApi.get(filters);
        setCount(count);
        setData(data);
      } catch (error) {
        console.error(error);
      }
    }
    verifyLogin();
    getDepartmentAndYouthBranch();
  }, [filters, count, history]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  const handleAddDepartment = (department: any) => {
    setData((data) => [department, ...data]);
  };

  const handleUpdateDepartment = (department: any) => {
    setData((data) =>
      data.map((item) => (department.id === item.id ? department : item))
    );
  };

  const handleSubmitFile = async (data: any) => {
    try {
      if (
        data.length === 2 &&
        data[0][0].length === 2 &&
        data[1][0].length === 2
      ) {
        dispatch(setSpinner(true));
        data[0].shift();
        data[1].shift();
        const response = await DepartmentApi.createDepartmentList(data[0]);
        await DepartmentApi.createYouthBranchList(data[1]);
        setData(response);
        setTimeout(() => {
          dispatch(setSpinner(false));
        }, 500);
      } else {
        alert("không đúng định dạng file");
      }
    } catch (error) {
      alert("không đúng định dạng file");
      console.error(error);
    }
  };

  if (isSpinner) return <Spinner />;
  return (
    <>
      <CCard>
        {/* <CCardHeader>Quản lý đơn vị</CCardHeader> */}
        <CCardHeader>
          <strong>QUẢN LÝ ĐƠN VỊ</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol sm="4" className="d-flex align-items-center">
              <CTooltip content={`Mã đơn vị,Tên đơn vị`}>
                <CIcon className="mr-1" size="lg" content={freeSet.cilFilter} />
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
                style={{ width: "60px", float: "right", margin: "0 10px" }}
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
              <CTooltip content="Thêm">
                <CButton
                  size="sm"
                  color="info"
                  className="mr-2"
                  onClick={() =>
                    setModal((modal) => ({
                      ...modal,
                      open: true,
                      isAdd: true,
                      value: { id: 0, code: "", name: "" },
                    }))
                  }
                >
                  <CIcon size="lg" content={freeSet.cilNoteAdd} />
                </CButton>
              </CTooltip>

              <SheetApp handleSubmitFile={handleSubmitFile} />
            </CCol>
            <CCol sm="4"></CCol>
          </CRow>
          <CDataTable
            items={data}
            fields={fields}
            hover
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
              code: (item: any) => {
                return (
                  <td className="align-middle text-center">{item.code}</td>
                );
              },
              name: (item: any) => {
                return (
                  <td className="align-middle text-center">{item.name}</td>
                );
              },
              action: (item: any) => {
                return (
                  <>
                    {roles.ADMIN.includes(user.role) && (
                      <>
                        <td className="text-center">
                          {/* <CTooltip content="Chi đoàn">
                            <CButton
                              size="sm"
                              color="light"
                              className="ml-1 mt-1"
                              onClick={() =>
                                history.push(`chi-doan/${item.code}`)
                              }
                            >
                              <CIcon size="sm" content={freeSet.cilFolder} />
                            </CButton>
                          </CTooltip> */}

                          <CTooltip content="Chỉnh sửa">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() =>
                                setModal((modal) => ({
                                  ...modal,
                                  isAdd: false,
                                  open: true,
                                  value: {
                                    id: item.id,
                                    code: item.code,
                                    name: item.name,
                                  },
                                }))
                              }
                            >
                              <CIcon size="sm" content={freeSet.cilSettings} />
                            </CButton>
                          </CTooltip>

                          {/* <CTooltip content='Xóa'>
                            <CButton
                              size='sm'
                              color='danger'
                              className='ml-1 mt-1'
                              onClick={() => setModalDelete(true)}>
                              <CIcon size='sm' content={freeSet.cilTrash} />
                            </CButton>
                          </CTooltip> */}
                        </td>
                      </>
                    )}
                  </>
                );
              },
            }}
          ></CDataTable>
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
      <FormAddDepartment
        value={modal.value}
        onAddDepartment={handleAddDepartment}
        onUpdateDepartment={handleUpdateDepartment}
        isOpen={modal.open}
        isAdd={modal.isAdd}
        onClose={() =>
          setModal((data) => ({
            ...data,
            open: false,
          }))
        }
      />
      <FormDeleteDepartment
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
      />
    </>
  );
}

export default Department;
