import React from "react";
import { Link } from "react-router-dom";

const FloatingButton = ({ onClick, icon, customClass, to }) => {
  const className = `btn-floating waves-effect waves-light ${customClass}`;
  const renderIcon = <i className="material-icons">{icon}</i>;

  return to ? (
    <Link className={className} to={to}>
      {renderIcon}
    </Link>
  ) : (
    <a className={className} onClick={onClick}>
      {renderIcon}
    </a>
  );
};

export default FloatingButton;
