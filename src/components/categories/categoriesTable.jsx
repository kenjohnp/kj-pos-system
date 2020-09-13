import React, { Fragment } from "react";
import Switch from "react-switch";
import Table from "../common/table";

const CategoriesTable = ({
  categories,
  onSort,
  sortColumn,
  onDelete,
  onChange,
}) => {
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
          <button
            className="btn-floating waves-effect waves-light red ml-1"
            onClick={() => onDelete(category._id)}
          >
            <i className="material-icons">delete</i>
          </button>
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
