import React from "react";
import LoadSpinner from "react-loader-spinner";

const Loader = ({ className, type = "ThreeDots" }) => {
  return (
    <LoadSpinner
      type={type}
      color="#4CAF50"
      height={40}
      width={40}
      className={className || "right-align"}
    />
  );
};

export default Loader;
