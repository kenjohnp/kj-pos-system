import React from "react";

const Input = ({
  placeholder,
  name,
  value,
  onChange,
  columnClass,
  label,
  type = "text",
  error,
}) => {
  return (
    <div className={"input-field " + columnClass}>
      <input
        placeholder={placeholder}
        type={type}
        id={name}
        value={value}
        name={name}
        onChange={onChange}
      />
      <label htmlFor={name} className="active">
        {label}
      </label>
      {error && <div className="red-text">{error}</div>}
    </div>
  );
};

export default Input;
