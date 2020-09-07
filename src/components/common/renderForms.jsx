import React from "react";
import Input from "./input";
import ConditionalWrapper from "./conditionalWrapper";
import { Link } from "react-router-dom";

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
  color = "grey",
  link = "#"
) => (
  <Link
    className={`waves-effect waves-light btn-${size} ${color}`}
    style={{ marginRight: "5px" }}
    onClick={onClick}
    to={link}
    key={label}
  >
    <i className="material-icons left">{icon}</i>
    {label}
  </Link>
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
