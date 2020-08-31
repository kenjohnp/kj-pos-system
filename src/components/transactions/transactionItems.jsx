import React from "react";
import Table from "../common/table";
import Input from "../common/input";
import FloatingButton from "../common/floatingButton";

const TransactionItems = ({ items, onChange }) => {
  const columns = [
    {
      label: "Barcode",
      path: "barcode",
    },
    {
      label: "Item Name",
      path: "itemName",
    },
    {
      label: "Price",
      path: "price",
      style: { textAlign: "right" },
      width: "10%",
      content: (item) => renderInput("price", item),
    },
    {
      label: "Qty",
      path: "qty",
      style: { textAlign: "right" },
      width: "10%",
      content: (item) =>
        renderInput("qty", item, {
          readOnly: false,
          onChange,
        }),
    },
    {
      label: "Discount",
      path: "discount",
      style: { textAlign: "right" },
      width: "10%",
      content: (item) =>
        renderInput("discount", item, {
          readOnly: false,
          onChange,
        }),
    },
    {
      label: "Total Amount",
      key: "totalAmount",
      style: { textAlign: "right" },
      width: "15%",
      content: (item) =>
        renderInput("totalAmount", {
          totalAmount: item.qty * (item.price - item.discount),
        }),
    },
    {
      key: "delete",
      content: (item) => (
        <FloatingButton
          icon="delete"
          customClass="red ml-1"
          onClick={() => {}}
        />
      ),
    },
  ];

  const renderInput = (path, item, options = {}) => (
    <Input
      name={path + item.index}
      value={item[path]}
      type="number"
      customClass="m-0"
      min={0}
      style={{ textAlign: "right" }}
      onChange={(e) =>
        options.onChange(path, item.index, e.currentTarget.value)
      }
      readOnly={options.readOnly === false ? false : true}
    />
  );

  return <Table data={items} columns={columns} />;
};

export default TransactionItems;
