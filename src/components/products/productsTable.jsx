import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Table from "../common/table";
import Loader from "../common/loader";
import FloatingButton from "../common/floatingButton";

const ProductsTable = ({ products, sortColumn, onSort, onDelete }) => {
  const columns = [
    {
      path: "barcode",
      label: "Barcode",
    },
    {
      path: "description",
      label: "Description",
    },
    {
      path: "category.name",
      label: "Category",
    },
    {
      path: "price",
      label: "Price",
    },
    {
      path: "inStock",
      label: "In Stock",
    },
    {
      key: "options",
      content: (category) => (
        <Fragment>
          <FloatingButton
            to={`/products/${category._id}`}
            icon="edit"
            customClass="blue ml-1"
          />
          <FloatingButton
            onClick={() => onDelete(category._id)}
            icon="delete"
            customClass="red ml-1"
          />
        </Fragment>
      ),
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

export default ProductsTable;
