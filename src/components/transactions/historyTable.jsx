import React from "react";
import Table from "../common/table";
import PropTypes from "prop-types";

const HistoryTable = ({ products, sortColumn, onSort, onDelete }) => {
  const columns = [
    {
      path: "date",
      label: "Date",
    },
    {
      path: "transactionNo",
      label: "Transaction No.",
    },
  ];

  return (
    <Table
      columns={columns}
      data={products}
      sortColumn={sortColumn}
      onSort={onSort}
    ></Table>
  );
};

HistoryTable.propTypes = {
  products: PropTypes.array,
  sortColumn: PropTypes.object,
  onSort: PropTypes.func,
  onDelete: PropTypes.func,
};

export default HistoryTable;
