import { CFormGroup, CLabel } from "@coreui/react";

const SelectField = (props: any) => {
  const { field, label, values, placeholder } = props;
  const { name, value } = field;

  return (
    <CFormGroup>
      <CLabel htmlFor={name}>{label}</CLabel>
      <select
        className="form-control"
        value={null}
        id={name}
        {...field}
        placeholder={placeholder}
        autoFocus={true}
      >
        {values.map((item: { value: string; name: string }, index: number) => (
          <option
            key={index}
            disabled={item.value === ""}
            selected={item.value === value}
            value={item.value}
          >
            {item.name}
          </option>
        ))}
      </select>
    </CFormGroup>
  );
};

SelectField.propTypes = {};

export default SelectField;
