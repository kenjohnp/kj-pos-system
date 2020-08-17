import React from "react";
import Table from "../common/table";
import moment from "moment";
import FloatingButton from "../common/floatingButton";

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
    {
      path: "refNo",
      label: "Reference Number",
    },
    {
      path: "remarks",
      label: "Remarks",
    },
    {
      key: "options",
      label: "View/Cancel",
      content: (stockEntry) => (
        <>
          <FloatingButton
            to={`/stockentries/${stockEntry._id}`}
            icon="visibility"
            customClass="green ml-1"
          />
          <FloatingButton icon="cancel" customClass="red ml-1" />
        </>
      ),
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
