import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import _ from "lodash";

const Pagination = (props) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;

  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  return (
    <ul className="pagination">
      {pages.map((page) => (
        <li
          key={page}
          className={page === currentPage ? "active green" : "waves-effect"}
          style={{ cursor: "pointer" }}
        >
          <Link to="#" onClick={() => onPageChange(page)}>
            {page}
          </Link>
        </li>
      ))}
    </ul>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
