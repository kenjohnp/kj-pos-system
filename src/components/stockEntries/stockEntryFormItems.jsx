import React from "react";
import Table from "../common/table";
import Select from "../common/select";

const StockEntryFormItems = ({ items }) => {
  const columns = [
    {
      path: "name",
      label: "Item Name",
      content: (item) => <Select unWrap />,
    },
    { path: "qty", label: "Quantity" },
  ];

  return <Table columns={columns} data={items} sortColumn="name" />;
};

export default StockEntryFormItems;
