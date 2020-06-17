import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import getPagedData from "../../utils/getPagedData";
import {
  loadCategories,
  updateCategory,
  removeCategory,
  setSuccess,
} from "../../store/categories";
import CategoriesTable from "./categoriesTable";
import Pagination from "../common/pagination";
import Search from "../common/search";
import PageTitle from "../common/pageTitle";
import Loader from "../common/loader";

const Categories = () => {
  const dispatch = useDispatch();
  const { list: categories, errors, loading } = useSelector(
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
    const currentPagination = { ...pagination };
    currentPagination.currentPage = 1;
    setPagination(currentPagination);
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

  const { totalCount, data } = getPagedData({
    data: categories,
    searchQuery,
    searchFields: ["name"],
    sortColumn,
    pagination,
  });

  return (
    <Fragment>
      <PageTitle title="Categories" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/categories/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search searchQuery={searchQuery} onChange={(e) => handleChange(e)} />
      </div>
      {loading && <Loader />}
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
