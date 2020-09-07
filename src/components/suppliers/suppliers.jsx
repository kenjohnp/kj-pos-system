import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import getPagedData from "../../utils/getPagedData";
import {
  loadSuppliers,
  clearErrors,
  setSuccess,
  removeSupplier,
} from "../../store/suppliers";
import PageTitle from "../common/pageTitle";
import Pagination from "../common/pagination";
import Loader from "../common/loader";
import Search from "../common/search";
import ConfirmModal from "../common/confirmModal";
import SuppliersTable from "./suppliersTable";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { list: suppliers, loading, errors } = useSelector(
    (state) => state.entities.suppliers
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    dispatch(loadSuppliers());
    dispatch(setSuccess(false));
    return () => {
      dispatch(clearErrors());
    };
  }, []);

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleDelete = (id) => {
    setIsModalOpen(true);
    setSelectedSupplier(id);
  };

  const handleConfirmDelete = () => {
    dispatch(removeSupplier({ _id: selectedSupplier }));
    handleModalClose();
  };

  const handleModalClose = () => {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    setSearchQuery(input.value);
    const currentPagination = { ...pagination };
    currentPagination.currentPage = 1;
    setPagination(currentPagination);
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const { totalCount, data } = getPagedData({
    data: suppliers,
    searchQuery,
    searchFields: ["name", "contactPerson"],
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
      <PageTitle title="Suppliers" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/suppliers/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search searchQuery={searchQuery} onChange={handleChange} />
      </div>
      <Loader loading={loading} />
      <SuppliersTable
        suppliers={data}
        sortColumn={sortColumn}
        onSort={handleSort}
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

export default Suppliers;
