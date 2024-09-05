import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { FormCriteriaUpdate } from "./FormCriteriaUpdate";

const TestFormCriteria = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSubmitForm = (values: any) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <FormCriteriaUpdate
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitForm}
        isOpen={isOpen}
        item={{
          name: "danh hieu",
          isCriteria: true,
          evidence: true,
          method: "binary",
          lowerSign: ">=",
          lowerPoint: 10,
          upperSign: "<=",

          upperPoint: 100,
        }}
      />
      <CButton onClick={() => setIsOpen(true)} color="info">
        Mở form tiêu chí
      </CButton>
    </div>
  );
};

export default TestFormCriteria;
