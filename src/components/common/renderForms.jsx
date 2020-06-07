import React from "react";
import Input from "./input";

export const renderInput = ({
  name,
  label,
  customClass,
  data,
  error,
  onChange,
  placeholder,
  type,
  readOnly,
  defaultValue,
}) => (
  <div className="row">
    <Input
      label={label}
      placeholder={placeholder || ""}
      name={name}
      value={data}
      customClass={customClass}
      onChange={onChange}
      type={type || "text"}
      error={error}
      readOnly={readOnly}
      defaultValue={defaultValue}
    />
  </div>
);

export const renderButton = (label, onClick, customClass) => (
  <button className={`btn ${customClass}`} onClick={onClick}>
    {label}
  </button>
);

export const renderRadioButton = (name, label, checked, onChange) => (
  <p>
    <label>
      <input
        className="with-gap"
        name={name}
        type="radio"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  </p>
);
