import { CFormGroup, CInput, CLabel } from "@coreui/react";
import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const InputDatePicker = (props: any) => {
  const { field, label, maxDate, minDate, placeholder, required } =
    props
  const { name, value } = field

  const handleChange = (dateValue: any) => {
    const changeEvent = {
      target: {
        name: name,
        value: dateValue,
      },
    };
    field.onChange(changeEvent);
  };
  const Input = (pros: any) => {
    const { onChange, placeholder, value, id, onClick } = pros;
    return (
      <CInput
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
      />
    );
  };

  return (
    <CFormGroup>
      <CLabel htmlFor={name}>
        <div>
          {label} <span style={{ color: 'red' }}>{required}</span>
        </div>
      </CLabel>
      <DatePicker
        {...field}
        selected={value}
        maxDate={maxDate}
        minDate={minDate}
        onChange={handleChange}
        locale='vi'
        customInput={<Input />}
        placeholderText={placeholder}
        dateFormat='dd/MM/yyyy'
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
      />
    </CFormGroup>
  )
};

InputDatePicker.propTypes = {};

export default InputDatePicker;
