import React from "react";
import LoadSpinner from "react-loader-spinner";
import PropTypes from "prop-types";

const Loader = ({ className, type = "ThreeDots", loading }) => {
  return loading ? (
    <LoadSpinner
      type={type}
      color="#4CAF50"
      height={40}
      width={40}
      className={className || "right-align"}
    />
  ) : (
    <></>
  );
};

Loader.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

export default Loader;
