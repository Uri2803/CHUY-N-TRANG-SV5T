import {
  CButton,
  CCardBody,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import AuditorApi from "../../api/Achievement/auditorApi";
import UserApi from "../../api/Achievement/userApi";

const dogOptions = [
  { value: 1, label: "Người chấm tổng duyệt", isDisabled: false },
  { value: 2, label: "Người chấm", isDisabled: false },
];

const Modal = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any[]>([]);
  const [defaultUser, setDefaultUser] = useState<any[]>([]);
  const [auditor, setAuditor] = useState<any[]>([]);
  const [auditorFinal, setAuditorFinal] = useState();
  const achievementId = 40;
  const [displaySelect, setDisplaySelect] = useState(0);
  useEffect(() => {
    async function getUserAll() {
      Promise.all([
        UserApi.getAll(),
        AuditorApi.getAuditorsForAchievement(achievementId),
      ])
        .then((values) => {
          dogOptions[0].isDisabled = values[1].some(
            (val: any) => val.isFinal === true
          );
          const auditors = values[1].reduce((pre: any, val: any) => {
            if (val.isFinal) return pre;
            return [
              ...pre,
              {
                value: val.id,
                label: val.email,
              },
            ];
          }, []);
          setUser(
            values[0].map((res) => ({
              value: res.id,
              label: res.email,
              isDisabled: values[1].find(
                (val: any) => res.email === val.email && val.isFinal
              ),
            }))
          );
          setDefaultUser(auditors);
          setAuditor(auditors);
        })
        .catch((err) => console.error(err));
    }
    getUserAll();
  }, []);
  const handleChange = (newValue: any, actionMeta: any) => {
    if (actionMeta.action === "clear") {
      setDisplaySelect(0);
    } else {
      setDisplaySelect(newValue.value);
    }
  };

  const handleChangeMulti = (newValue: any, actionMeta: any) => {
    setAuditor(newValue);
  };

  const handleChangeSingle = (newValue: any, actionMeta: any) => {
    setAuditorFinal(newValue);
  };

  const handleSubmit = () => {
    if (displaySelect === 1) {
    } else {
    }
  };

  return (
    <>
      <CButton color="primary" onClick={() => setOpen(true)}>
        {" "}
        click open modal
      </CButton>
      <CCardBody>
        <CModal
          show={open}
          onClose={() => {
            setOpen(false);
          }}
          size="lg"
          color="info"
        >
          <CModalHeader closeButton>
            <CModalTitle>Thêm người chấm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <Select
              className="mb-3"
              placeholder="Vui lòng chọn"
              name="color"
              isClearable={true}
              onChange={handleChange}
              options={dogOptions}
            />
            {displaySelect === 1 ? (
              <Select
                isSearchable={true}
                isClearable={true}
                onChange={handleChangeSingle}
                options={user}
                placeholder="Vui lòng chọn"
              />
            ) : undefined}
            {displaySelect === 2 ? (
              <Select
                isMulti
                defaultValue={defaultUser}
                name="MultiUser"
                options={user}
                onChange={handleChangeMulti}
                placeholder="Vui lòng chọn"
              />
            ) : undefined}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="info"
              disabled={displaySelect === 0}
              onClick={handleSubmit}
            >
              Gửi
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </>
  );
};

export default Modal;
