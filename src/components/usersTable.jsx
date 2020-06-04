import React from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";

const UsersTable = ({ users, onSort, sortColumn, onDelete, onEdit }) => {
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
      path: "role",
      label: "Role",
      content: (user) => (
        <span className={user.isAdmin ? "role green" : "role blue"}>
          {user.isAdmin ? "ADMIN" : "CASHIER"}
        </span>
      ),
    },
    {
      key: "edit",
      content: (user) => (
        <React.Fragment>
          <Link
            className="btn-floating waves-effect waves-light blue"
            to={`/users/${user._id}`}
            onClick={() => onEdit(user._id)}
          >
            <i className="material-icons">edit</i>
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

  return (
    <Table
      columns={columns}
      data={users}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default UsersTable;
