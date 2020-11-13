import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";

const SideNav = () => {
  return (
    <Fragment>
      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <img className="responsive-img" src={logo} />
          </div>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a className="subheader">Main</a>
        </li>
        <li>
          <Link to="/dashboard" className="sidenav-close">
            <i className="material-icons">dashboard</i>Go to Dashboard
          </Link>
        </li>
        <li>
          <Link to="/transaction" className="sidenav-close">
            <i className="material-icons">add_shopping_cart</i>Start Transaction
          </Link>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a className="subheader">Manage</a>
        </li>
        <li>
          <Link to="/products" className="sidenav-close">
            <i className="material-icons">shopping_cart</i>Products
          </Link>
        </li>
        <li>
          <Link to="/categories" className="sidenav-close">
            <i className="material-icons">storage</i>Categories
          </Link>
        </li>
        <li>
          <Link to="/suppliers" className="sidenav-close">
            <i className="material-icons">shopping_basket</i>Suppliers
          </Link>
        </li>

        <li>
          <Link to="/stockentries" className="sidenav-close">
            <i className="material-icons">local_shipping</i>Stock Entry
          </Link>
        </li>
        <li>
          <Link to="/users" className="sidenav-close">
            <i className="material-icons">account_circle</i>Users
          </Link>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a className="subheader">Summary</a>
        </li>
        <li>
          <Link to="/transactionsHistory" className="sidenav-close">
            <i className="material-icons">add_shopping_cart</i>Transactions
            History
          </Link>
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
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <Link to="/logout" className="sidenav-close">
            <i className="material-icons">power_settings_new</i>Logout
          </Link>
        </li>
      </ul>
    </Fragment>
  );
};

export default SideNav;
