import React from "react";
import LoadSpinner from "react-loader-spinner";

const Loader = () => {
  return (
    <LoadSpinner
      type="TailSpin"
      color="#4CAF50"
      height={80}
      width={80}
      className="center-align"
    />
  );
};

export default Loader;
