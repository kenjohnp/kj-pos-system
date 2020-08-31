import React from "react";
import ReactSelect from "react-select";
import ConditionalWrapper from "../common/conditionalWrapper";
import { renderButton } from "../common/renderForms";

const Select = ({
  options,
  value,
  placeHolder,
  onChange,
  error,
  label,
  name,
  tableItem = false,
  wrappedInRow = true,
  isDisabled = false,
  ...rest
}) => {
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

    menuList: (provided, state) => ({
      ...provided,
      position: "absolute",
      backgroundColor: "white",
      zIndex: "999",
      borderLeft: "5px solid green",
      borderRight: "1px solid #ccc",
      width: "100%",
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
    <ConditionalWrapper
      condition={wrappedInRow}
      wrapper={(children) => (
        <div className={"row " + (tableItem && "m-0")}>
          <div className={"col s12 " + (tableItem && "p-0")}>{children}</div>
        </div>
      )}
    >
      <label>{label}</label>
      <ReactSelect
        options={options}
        isSearchable={true}
        styles={customStyles}
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <div className="red-text">{error}</div>}
    </ConditionalWrapper>
  );
};

export default Select;
