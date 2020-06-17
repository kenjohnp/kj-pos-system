import React from "react";
import LoadSpinner from "react-loader-spinner";

const Loader = () => {
  return (
    <LoadSpinner
      type="ThreeDots"
      color="#4CAF50"
      height={40}
      width={40}
      className="right-align"
    />
  );
};

export default Loader;
