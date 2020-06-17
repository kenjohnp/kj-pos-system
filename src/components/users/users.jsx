import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import UsersTable from "./usersTable";
import Pagination from "../common/pagination";
import Search from "../common/search";
import PageTitle from "../common/pageTitle";
import getPagedData from "../../utils/getPagedData";
import {
  deleteUser,
  loadUsers,
  updateUser,
  setSuccess,
  clearErrors,
} from "../../store/users";
import ConfirmModal from "../common/confirmModal";

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, errors } = useSelector((state) => state.entities.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({
    path: "username",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    pageSize: 7,
    currentPage: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(loadUsers());
    dispatch(setSuccess(false));
    return () => {
      dispatch(clearErrors());
    };
  }, []);

  const handleDelete = (userId) => {
    setIsModalOpen(true);
    setSelectedUser(userId);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUser({ _id: selectedUser }));
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleToggleAdmin = (id, isAdmin) => {
    dispatch(updateUser({ _id: id, isAdmin: !isAdmin, type: "toggleAdmin" }));
  };

  const handleChange = (e) => {
    setSearchQuery(e.currentTarget.value);
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
    data: users,
    searchQuery,
    searchFields: ["firstname", "username", "lastname"],
    sortColumn,
    pagination,
  });

  return (
    <Fragment>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onClose={handleModalClose}
        onSubmit={handleConfirmDelete}
        submitColor="red"
        submitLabel="DELETE"
        headerLabel="Confirm Delete"
      />

      <PageTitle title="Users" />
      {errors.apiError.message && (
        <div className="red white-text center statusBox">
          {errors.apiError.message}
        </div>
      )}
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/users/new"
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
        <Search searchQuery={searchQuery} onChange={(e) => handleChange(e)} />
      </div>
      <UsersTable
        users={data}
        sortColumn={sortColumn}
        onSort={(sortColumn) => handleSort(sortColumn)}
        onDelete={(id) => handleDelete(id)}
        onChange={(id, isAdmin) => handleToggleAdmin(id, isAdmin)}
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

export default Users;
