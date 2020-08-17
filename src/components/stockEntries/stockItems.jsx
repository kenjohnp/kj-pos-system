import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "../common/table";
import Input from "../common/input";
import Select from "../common/select";
import FloatingButton from "../common/floatingButton";

const StockItems = ({ items, onChange, onDelete, readOnly }) => {
  const { list: products } = useSelector((state) => state.entities.products);

  const [productsOptions, setProductsOptions] = useState([]);

  const initialOptions = products.map((p) => ({
    label: p.description,
    value: p._id,
  }));

  useEffect(() => {
    setProductsOptions(initialOptions);
  }, [products]);

  const filterSelected = () => {
    let selectedItems = [];
    for (let i = 0; i < items.length; i++) selectedItems.push(items[i].item);

    const newProductOptions = productsOptions.filter(
      (i) => !selectedItems.includes(i)
    );

    setProductsOptions(newProductOptions);
  };

  const returnItemOption = (selectedItem) => {
    const newProductOptions = [...productsOptions];
    newProductOptions.push(selectedItem);
    newProductOptions.sort((a, b) => (a.label > b.label ? 1 : -1));
    setProductsOptions(newProductOptions);
  };

  const columns = [
    {
      label: "Item Name",
      path: "item",
      key: "item",
      width: "80%",
      content: (item) => (
        <Select
          options={productsOptions}
          placeHolder="Select item"
          tableItem
          onChange={(selectedItem) => {
            onChange("item", item.index, selectedItem);
            filterSelected();
          }}
          value={item.item}
          isDisabled={readOnly}
        />
      ),
    },
    {
      label: "Stock",
      path: "qty",
      key: "qty",
      content: (item) => (
        <Input
          name="qty"
          value={item.qty}
          customClass="m-0"
          type="number"
          min={0}
          style={{ textAlign: "right" }}
          onChange={(e) => onChange("qty", item.index, e.currentTarget.value)}
          readOnly={readOnly}
        />
      ),
    },
    {
      key: "delete",
      content: (item) =>
        item.item !== "" &&
        !readOnly && (
          <FloatingButton
            icon="delete"
            customClass="red ml-1"
            onClick={() => {
              onDelete(item.index);
              returnItemOption(item.item);
            }}
          />
        ),
    },
  ];

  return <Table columns={columns} data={items} />;
};

export default StockItems;
