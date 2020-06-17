import React from "react";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { useSelector } from "react-redux";
import Loader from "../common/loader";
import Table from "../common/table";

const UsersTable = ({ users, onSort, sortColumn, onDelete, onChange }) => {
  const loading = useSelector((state) => state.entities.users.loading);

  const columns = [
    {
      path: "username",
      label: "Username",
    },
    {
      path: "firstname",
      label: "Name",
      key: "name",
      content: (user) => `${user.firstname} ${user.lastname}`,
    },
    {
      path: "isAdmin",
      label: "Admin",
      content: (user) => (
        <Switch
          checked={user.isAdmin}
          onChange={() => onChange(user._id, user.isAdmin)}
        />
      ),
    },
    {
      key: "options",
      content: (user) => (
        <React.Fragment>
          <Link
            to={`/users/resetpassword/${user._id}`}
            className="btn-small blue waves-effect waves-light"
          >
            Reset Password
          </Link>
          <Link
            to={`/users/changename/${user._id}`}
            className="btn-small blue waves-effect waves-light ml-1"
          >
            Change Name
          </Link>
          <a
            className="btn-floating waves-effect waves-light red ml-1"
            onClick={() => onDelete(user._id)}
          >
            <i className="material-icons">delete</i>
          </a>
        </React.Fragment>
      ),
    },
  ];

  return loading ? (
    <Loader />
  ) : (
    <Table
      columns={columns}
      data={users}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default UsersTable;
