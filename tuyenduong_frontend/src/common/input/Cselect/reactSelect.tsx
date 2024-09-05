import { CFormGroup, CLabel } from "@coreui/react";
import Select from "react-select";
import React from "react";

const ReactSelect = (props: any) => {
  const { field, form, label, values, placeholder,isMulti, required, bold, disabled } =
    props;
  const { name, value } = field;
  const { errors } = form;
  const showError: boolean = !!errors[name];

  const selectedValue = values.find((option: any) => option.value === value);

  const handleChange = (selectedOption: any) => {
    const selectedValue = selectedOption
      ? selectedOption.value
      : selectedOption;

    const changeEvent = {
      target: {
        name: name,
        value: selectedValue,
      },
    };
    field.onChange(changeEvent);
  };

  return (
    <CFormGroup>
      <CLabel htmlFor={name}>
        {bold ? (
          <div>
            <b>{label}</b> <span style={{ color: 'red' }}>{required}</span>
          </div>
        ) : (
          <div>
            {label} <span style={{ color: 'red' }}>{required}</span>
          </div>
        )}
      </CLabel>
      {isMulti ? (
        <Select
          isMulti
          id={name}
          {...field}
          value={selectedValue}
          onChange={handleChange}
          placeholder={placeholder}
          name='color'
          isClearable={true}
          options={values}
          isDisabled={disabled}
        />
      ) : (
        <Select
          id={name}
          {...field}
          value={selectedValue}
          onChange={handleChange}
          placeholder={placeholder}
          name='color'
          isClearable={true}
          options={values}
          isDisabled={disabled}
        />
      )}
      <p style={{ color: 'red' }}>{showError && errors[name]}</p>
    </CFormGroup>
  )
};

ReactSelect.propTypes = {};

export default ReactSelect;
