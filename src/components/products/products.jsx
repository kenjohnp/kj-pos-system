import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  loadProducts,
  setSuccess,
  removeProduct,
  clearErrors,
} from "../../store/products";
import getPagedData from "../../utils/getPagedData";
import PageTitle from "../common/pageTitle";
import ProductsTable from "./productsTable";
import Pagination from "../common/pagination";
import Search from "../common/search";
import Loader from "../common/loader";
import ConfirmModal from "../common/confirmModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(setSuccess(false));

    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

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
    setIsModalOpen(true);
    setSelectedProduct(id);
  };

  const handleConfirmDelete = () => {
    dispatch(removeProduct({ _id: selectedProduct }));
    handleModalClose();
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const { totalCount, data } = getPagedData({
    data: products,
    searchQuery,
    searchFields: ["description", "barcode", "category.name"],
    sortColumn,
    pagination,
  });

  const { pageSize, currentPage } = pagination;

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onClose={handleModalClose}
        onSubmit={handleConfirmDelete}
        submitColor="red"
        submitLabel="DELETE"
        headerLabel="Confirm Delete"
      />
      <PageTitle title="Products" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
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
      <Loader loading={loading} />
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
    </>
  );
};

export default Products;
