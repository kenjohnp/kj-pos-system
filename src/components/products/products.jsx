import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loadProducts, setSuccess, removeProduct } from "../../store/products";
import getPagedData from "../../utils/getPagedData";
import PageTitle from "../common/pageTitle";
import ProductsTable from "./productsTable";
import Pagination from "../common/pagination";
import Search from "../common/search";

const Products = () => {
  const dispatch = useDispatch();
  const { list: products, loading, errors } = useSelector(
    (state) => state.entities.products
  );
  const [sortColumn, setSortColumn] = useState({
    path: "description",
    order: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 7,
    currentPage: 1,
  });

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(setSuccess(false));
  }, [products]);

  const handleChange = ({ currentTarget: input }) => {
    setSearchQuery(input.value);
    const currentPagination = { ...pagination };
    currentPagination.currentPage = 1;
    setPagination(currentPagination);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleDelete = (id) => {
    dispatch(removeProduct({ _id: id }));
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const { totalCount, data } = getPagedData({
    data: products,
    searchQuery,
    searchFields: ["description", "barcode"],
    sortColumn,
    pagination,
  });

  const { pageSize, currentPage } = pagination;

  return (
    <Fragment>
      <PageTitle title="Products" />
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/products/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search searchQuery={searchQuery} onChange={handleChange} />
      </div>
      {errors.apiError.message ? (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      ) : (
        <Fragment>
          <ProductsTable
            products={data}
            sortColumn={sortColumn}
            onSort={(sortColumn) => handleSort(sortColumn)}
            onDelete={handleDelete}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(currentPage) => handlePageChange(currentPage)}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
