import React, { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import auth from "../services/authService";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-wrapper green">
        {auth.getCurrentUser() && (
          <Link
            to="#"
            data-target="slide-out"
            className="sidenav-trigger show-on-large"
          >
            <i className="material-icons">menu</i>
          </Link>
        )}
        <div className="container">
          <Link to="/transaction" className="brand-logo">
            KJ POS
          </Link>
          {auth.getCurrentUser() && (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {auth.getCurrentUser().isAdmin && (
                <Fragment>
                  <li>
                    <NavLink to="/transaction">Transaction</NavLink>
                  </li>
                  <li>
                    <NavLink to="/transactionsHistory">
                      Transactions History
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/users">Users</NavLink>
                  </li>
                  <li>
                    <NavLink to="/products">Products</NavLink>
                  </li>
                  <li>
                    <NavLink to="/categories">Categories</NavLink>
                  </li>
                  <li>
                    <NavLink to="/suppliers">Suppliers</NavLink>
                  </li>
                  <li>
                    <NavLink to="/stockentries">Stock Entries</NavLink>
                  </li>
                  <li>
                    <NavLink to="/reports">Reports</NavLink>
                  </li>
                </Fragment>
              )}

              <li>
                <NavLink to="/logout">Logout</NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
