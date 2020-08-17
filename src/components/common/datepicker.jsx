import React from "react";
import ReactDatePicker from "react-datepicker";

const DatePicker = ({ error, ...rest }) => {
  return (
    <>
      <label>Date</label>
      <ReactDatePicker {...rest} />
      {error && <div className="red-text">{error}</div>}
    </>
  );
};

export default DatePicker;
