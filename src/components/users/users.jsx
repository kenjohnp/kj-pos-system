import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import UsersTable from "./usersTable";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import {
  deleteUser,
  loadUsers,
  updateUser,
  setSuccess,
} from "../../store/users";

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.entities.users);

  useEffect(() => {
    dispatch(loadUsers());
    dispatch(setSuccess(false));
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({
    path: "username",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    pageSize: 7,
    currentPage: 1,
  });

  const handleDelete = (userId) => {
    dispatch(deleteUser({ _id: userId }));
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleToggleAdmin = (id, isAdmin) => {
    dispatch(updateUser({ _id: id, isAdmin: !isAdmin }));
  };

  const handleChange = (e) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handlePageChange = (currentPage) => {
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const getPagedData = () => {
    let filtered = users;

    if (searchQuery)
      filtered = users.filter(
        (u) =>
          u.firstname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          u.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const paginatedUsers = paginate(
      sorted,
      pagination.currentPage,
      pagination.pageSize
    );

    return { totalCount: sorted.length, data: paginatedUsers };
  };

  const { totalCount, data } = getPagedData();

  return (
    <Fragment>
      <h4 className="green-text left-align">Users</h4>
      <div className="row mb-0 valign-wrapper">
        <div className="col s8">
          <Link
            className="btn-floating btn-large waves-effect waves-light green left-align"
            to="/users/new"
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
