import React from "react";

const Input = ({
  name,
  label,
  type = "text",
  error,
  value,
  customClass,
  icon,
  ...rest
}) => {
  return (
    <div className={"input-field " + customClass}>
      {icon && <i className="material-icons prefix">{icon}</i>}
      <input type={type} name={name} value={value} {...rest} />
      <label htmlFor={name} className="active">
        {label}
      </label>
      {error && <div className="red-text">{error}</div>}
    </div>
  );
};

export default Input;
