import React from "react";
import Table from "../common/table";
import FloatingButton from "../common/floatingButton";

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
    {
      key: "options",
      content: (supplier) => (
        <>
          <FloatingButton
            to={`/suppliers/${supplier._id}`}
            icon="edit"
            customClass="blue ml-1"
          />
          <FloatingButton
            onClick={() => onDelete(supplier._id)}
            icon="delete"
            customClass="red ml-1"
          />
        </>
      ),
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
