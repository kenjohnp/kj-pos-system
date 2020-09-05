import React from "react";
import Input from "./input";
import ConditionalWrapper from "./conditionalWrapper";
import Loader from "./loader";

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
  <ConditionalWrapper
    condition={!disableRow}
    wrapper={(children) => <div className="row">{children}</div>}
  >
    <Input
      label={label}
      placeholder={placeholder || ""}
      name={name}
      value={data}
      type={type || "text"}
      error={error}
      {...rest}
    />
  </ConditionalWrapper>
);

export const renderButton = (label, onClick, customClass) => (
  <button className={`btn ${customClass}`} onClick={onClick}>
    {label}
  </button>
);

export const renderIconButton = (
  label,
  onClick,
  icon,
  size = "large",
  customClass
) => (
  <a
    className={`waves-effect waves-light btn-${size} ${customClass}`}
    style={{ marginRight: "5px" }}
    onClick={onClick}
  >
    <i className="material-icons left">{icon}</i>
    {label}
  </a>
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
