import React from "react";
import PropTypes from "prop-types";

const Card = ({ icon, color, label, value }) => {
  return (
    <div className="col s6 m3">
      <div class="card-panel">
        <p>{label}</p>
        <h4>{value}</h4>
      </div>
    </div>
  );
};

Card.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Card;
