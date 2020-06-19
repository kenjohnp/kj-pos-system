import React from "react";
import Table from "../common/table";

const SuppliersTable = ({ suppliers, sortColumn, onSort, onDelete }) => {
  const columns = [
    {
      path: "name",
      label: "Name",
    },
    {
      path: "address",
      label: "Address",
    },
    {
      path: "contactPerson",
      label: "Contact Person",
    },
    {
      path: "contactNumber",
      label: "Contact Number",
    },
    {
      path: "fax",
      label: "Fax",
    },
    {
      path: "email",
      label: "Email",
    },
  ];

  return (
    <Table
      columns={columns}
      data={suppliers}
      onSort={onSort}
      sortColumn={sortColumn}
    ></Table>
  );
};

export default SuppliersTable;
