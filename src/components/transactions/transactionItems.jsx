import React from "react";
import Table from "../common/table";
import Input from "../common/input";
import FloatingButton from "../common/floatingButton";
import CurrencyInput from "react-currency-input-field";

const TransactionItems = ({ items, onChange, onDelete, onChangeDiscount }) => {
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
      content: (item) => (
        <Input
          name="qty"
          value={item.qty}
          type="number"
          customClass="m-0"
          min={1}
          style={{ textAlign: "right" }}
          onChange={(e) => onChange(item.index, e.currentTarget.value)}
          onKeyPress={(e) => preventNegative(e)}
        />
      ),
    },
    {
      label: "Discount",
      path: "discount",
      style: { textAlign: "right" },
      width: "10%",
      content: (item) => (
        <CurrencyInput
          name="discount"
          placeholder="0.00"
          prefix=""
          value={item.discount}
          onChange={(value, name) => onChangeDiscount(value, name, item.index)}
          style={{ textAlign: "right" }}
        />
      ),
    },
    {
      label: "Total Amount",
      key: "totalAmount",
      style: { textAlign: "right" },
      width: "15%",
      content: (item) =>
        renderInput("totalAmount", {
          totalAmount: item.qty * (item.price - (item.discount || 0)),
          index: item.index,
        }),
    },
    {
      key: "delete",
      content: (item) => (
        <FloatingButton
          icon="delete"
          customClass="red ml-1"
          onClick={() => onDelete(item.index)}
        />
      ),
    },
  ];

  const renderInput = (path, item) => (
    <CurrencyInput
      name={path + item.index}
      value={item[path] || "0.00"}
      customclass="m-0"
      style={{ textAlign: "right" }}
      readOnly
    />
  );

  const preventNegative = (e) => {
    if (
      !(
        (e.keyCode > 95 && e.keyCode < 106) ||
        (e.keyCode > 47 && e.keyCode < 58) ||
        e.keyCode == 8
      )
    ) {
      return false;
    }
  };

  return <Table data={items} columns={columns} />;
};

export default TransactionItems;
