import React from "react";
import Table from "../common/table";
import PropTypes from "prop-types";
import moment from "moment";
import FloatingButton from "../common/floatingButton";

const HistoryTable = ({ data, sortColumn, onSort }) => {
  const columns = [
    {
      path: "date",
      label: "Date",
      content: (stockEntry) => moment(stockEntry.date).format("MM/DD/YYYY"),
    },
    {
      path: "transactionNo",
      label: "Transaction No.",
    },
    {
      path: "items",
      label: "Items",
      width: "50%",
      content: (transaction) => (
        <span>{transaction.items.map((i) => i.itemName + ", ")}</span>
      ),
    },
    {
      path: "totalSales",
      label: "Total Sales",
      content: (transaction) =>
        "PHP " +
        transaction.totalSales.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      key: "options",
      label: "View",
      content: (transaction) => (
        <>
          <FloatingButton
            to={`/transaction/${transaction._id}`}
            icon="visibility"
            customClass="green ml-1"
          />
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      sortColumn={sortColumn}
      onSort={onSort}
    ></Table>
  );
};

HistoryTable.propTypes = {
  data: PropTypes.array,
  sortColumn: PropTypes.object,
  onSort: PropTypes.func,
  onDelete: PropTypes.func,
};

export default HistoryTable;
