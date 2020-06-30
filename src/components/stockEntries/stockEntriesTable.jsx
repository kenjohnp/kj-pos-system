import React from "react";
import Table from "../common/table";
import moment from "moment";

const StockEntriesTable = ({ stockEntries, sortColumn, onSort }) => {
  const columns = [
    {
      path: "date",
      label: "Date",
      content: (stockEntry) => moment(stockEntry.date).format("MM/DD/YYYY"),
    },
    {
      path: "supplier.name",
      label: "Supplier",
    },
  ];

  return (
    <Table
      columns={columns}
      data={stockEntries}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default StockEntriesTable;
