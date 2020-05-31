import React, { Fragment } from "react";

const SideNav = () => {
  return (
    <Fragment>
      <ul id="slide-out" className="sidenav">
        <li>
          <a href="#!">
            <i className="material-icons">account_circle</i>Users
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">shopping_cart</i>Products
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">storage</i>Categories
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">business_center</i>Brands
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">shopping_basket</i>Suppliers
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">add_shopping_cart</i>Transactions
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">local_shipping</i>Stock Entry
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">storage</i>Inventory
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="material-icons">insert_chart</i>Reports
          </a>
        </li>
      </ul>
    </Fragment>
  );
};

export default SideNav;
