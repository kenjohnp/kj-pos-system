import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import auth from "../services/authService";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-wrapper green">
        {auth.getCurrentUser() && (
          <a
            href="#"
            data-target="slide-out"
            className="sidenav-trigger show-on-large"
          >
            <i className="material-icons">menu</i>
          </a>
        )}
        <div className="container">
          <a href="#" className="brand-logo">
            KJ POS
          </a>
          {auth.getCurrentUser() && (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {auth.getCurrentUser().isAdmin && (
                <Fragment>
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
