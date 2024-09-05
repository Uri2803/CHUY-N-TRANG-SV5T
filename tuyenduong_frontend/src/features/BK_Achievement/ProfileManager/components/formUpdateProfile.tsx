import * as React from "react";
import {
  CButton,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import SubmissionApi from "../../../../api/Achievement/submissionApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (value: any) => void;
  value: { id: number; isVerified: boolean; idAchievement: number };
};

const FormUpdateProfile: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpdateProfile,
  value,
}) => {
  const handleOnSubmit = async () => {
    try {
      const updateProfile = value.isVerified
        ? await SubmissionApi.unConfirm(
            {
              id: value?.id,
            },
            value?.idAchievement
          )
        : await SubmissionApi.confirm(
            {
              id: value?.id,
            },
            value?.idAchievement
          );
      onUpdateProfile(updateProfile);
      onClose();
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal
            show={isOpen}
            size="lg"
            color={value.isVerified ? "danger" : "info"}
            onClosed={onClose}
          >
            <CModalHeader closeButton>
              <CModalTitle>
                {value.isVerified ? "Hủy xác nhận hồ sơ" : "Xác nhận hồ sơ"}
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Bạn có chắc chắn muốn {value.isVerified ? "hủy" : ""} duyệt hồ sơ
              này?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={onClose}>
                Hủy bỏ
              </CButton>
              <CButton
                color={value.isVerified ? "danger" : "primary"}
                onClick={handleOnSubmit}
                type="submit"
              >
                Xác nhận
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  );
};

export default FormUpdateProfile;