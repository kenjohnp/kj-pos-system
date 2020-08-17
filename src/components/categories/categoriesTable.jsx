import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import Loader from "../common/loader";
import Table from "../common/table";

const CategoriesTable = ({
  categories,
  onSort,
  sortColumn,
  onDelete,
  onChange,
}) => {
  const loading = useSelector((state) => state.entities.categories.loading);
  const columns = [
    {
      path: "name",
      label: "Category",
    },
    {
      path: "enabled",
      label: "Enabled",
      content: (category) => (
        <Switch
          checked={category.enabled}
          onChange={() => onChange(category._id, category.enabled)}
        />
      ),
    },
    {
      key: "options",
      content: (category) => (
        <Fragment>
          <a
            className="btn-floating waves-effect waves-light red ml-1"
            onClick={() => onDelete(category._id)}
          >
            <i className="material-icons">delete</i>
          </a>
        </Fragment>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={categories}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default CategoriesTable;
