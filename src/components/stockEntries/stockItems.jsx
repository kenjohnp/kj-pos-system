import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "../common/table";
import Input from "../common/input";
import Select from "../common/select";
import FloatingButton from "../common/floatingButton";

const StockItems = ({ items, onChange, onDelete, readOnly }) => {
  const { list: products } = useSelector((state) => state.entities.products);

  const [productsOptions, setProductsOptions] = useState([]);

  const initialOptions = () => {
    return products.map((p) => ({
      label: p.description,
      value: p._id,
    }));
  };

  useEffect(() => {
    setProductsOptions(initialOptions());
  }, [products]);

  const filterSelected = () => {
    const selectedItems = [];

    for (let i = 0; i < items.length; i++) selectedItems.push(items[i].item);

    const newProductOptions = initialOptions().filter(
      (i) => !selectedItems.find((s) => s.value === i.value)
    );

    console.log(selectedItems);

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
            const currentItem = item.item;
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
              filterSelected();
            }}
          />
        ),
    },
  ];

  return <Table columns={columns} data={items} />;
};

export default StockItems;
