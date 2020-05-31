import React, { useState, userEffect, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { getUsers, deleteUser } from "../services/fakeUserService";
import UsersTable from "./usersTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { useSelector, useDispatch } from "react-redux";
import { userRemoved } from "../store/users";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.entities.users);

  const [sortColumn, setSortColumn] = useState({
    path: "username",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    pageSize: 7,
    currentPage: 1,
  });

  const handleDelete = (user) => {
    dispatch(userRemoved({ _id: user }));
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handlePageChange = (currentPage) => {
    console.log(currentPage);
    const currentPagination = { ...pagination };
    currentPagination.currentPage = currentPage;
    setPagination(currentPagination);
  };

  const getPagedData = () => {
    const sorted = _.orderBy(users, [sortColumn.path], [sortColumn.order]);

    const paginatedUsers = paginate(
      sorted,
      pagination.currentPage,
      pagination.pageSize
    );

    return { totalCount: sorted.length, data: paginatedUsers };
  };

  const { totalCount, data } = getPagedData();

  return (
    <div className="container">
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
          <input id="icon_prefix" type="text" className="validate" />
          <label htmlFor="icon_prefix">Search</label>
        </div>
      </div>

      <UsersTable
        users={data}
        sortColumn={sortColumn}
        onSort={(sortColumn) => handleSort(sortColumn)}
        onEdit={(id) => handleEdit(id)}
        onDelete={(id) => handleDelete(id)}
      />
      <Pagination
        itemsCount={totalCount}
        pageSize={pagination.pageSize}
        currentPage={pagination.currentPage}
        onPageChange={(currentPage) => handlePageChange(currentPage)}
      />
    </div>
  );
};

export default Users;
