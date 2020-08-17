import React from "react";
import Input from "./input";

export const renderInput = ({
  name,
  label,
  data,
  error,
  placeholder,
  type,
  disableRow = false,
  ...rest
}) => (
  <div className={disableRow ? "" : "row"}>
    <Input
      label={label}
      placeholder={placeholder || ""}
      name={name}
      value={data}
      type={type || "text"}
      error={error}
      {...rest}
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
