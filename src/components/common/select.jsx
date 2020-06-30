import React from "react";
import ReactSelect from "react-select";

const Select = ({ options, value, placeHolder, onChange, error, label }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      border: "0",
      borderBottom: "1px solid #9e9e9e",
      borderRadius: 0,
      minHeight: "40px",
      height: "40px",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: "#26a69a",
        boxShadow: "0 1px 0 0 #26a69a",
      },
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected && "white",
      color: state.isSelected && "black",
      "&:hover": {
        backgroundColor: "#4CAF50",
        color: "white",
      },
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      padding: "0",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
      borderColor: "green",
    }),
  };

  return (
    <div className="row">
      <div className="col s12">
        <label>{label}</label>
        <ReactSelect
          options={options}
          isSearchable={true}
          styles={customStyles}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
        />
        {error && <div className="red-text">{error}</div>}
      </div>
    </div>
  );
};

export default Select;
