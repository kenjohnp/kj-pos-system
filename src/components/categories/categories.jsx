import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { paginate } from "../../utils/paginate";
import {
  loadCategories,
  updateCategory,
  removeCategory,
  setSuccess,
} from "../../store/categories";
import CategoriesTable from "./categoriesTable";
import Pagination from "../common/pagination";

const Categories = () => {
  const dispatch = useDispatch();

  const { list: categories, loading } = useSelector(
    (state) => state.entities.categories
  );

  const [sortColumn, setSortColumn] = useState({
    path: "name",
    order: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 7,
    currentPage: 1,
  });

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(setSuccess(false));
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setSearchQuery(input.value);
  };

  const handleDelete = (categoryId) => {
    dispatch(removeCategory({ _id: categoryId }));
  };

  const handleEnabled = (id, enabled) => {
    dispatch(updateCategory({ _id: id, enabled: !enabled }));
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const getPagedData = () => {
    let filtered = categories;

    if (searchQuery)
      filtered = categories.filter((c) =>
        c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const paginatedCategories = paginate(
      sorted,
      pagination.currentPage,
      pagination.pageSize
    );

    return { totalCount: sorted.length, data: paginatedCategories };
  };

  const { totalCount, data } = getPagedData();

  return (
    <Fragment>
      <h4 className="green-text left-align">Categories</h4>
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/categories/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <div className="input-field col s4 right-align">
          <i className="material-icons prefix">search</i>
          <input
            id="icon_prefix"
            type="text"
            value={searchQuery}
            onChange={handleChange}
          />
          <label htmlFor="icon_prefix">Search</label>
        </div>
      </div>
      <CategoriesTable
        categories={data}
        sortColumn={sortColumn}
        onChange={handleEnabled}
        onDelete={(id) => handleDelete(id)}
        onSort={(sortColumn) => handleSort(sortColumn)}
      />
      <Pagination
        itemsCount={totalCount}
        pageSize={pagination.pageSize}
        currentPage={pagination.currentPage}
        onPageChange={(currentPage) => handlePageChange(currentPage)}
      />
    </Fragment>
  );
};

export default Categories;
