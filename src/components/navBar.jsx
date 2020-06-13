import React from "react";
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
                <a href="collapsible.html">Supplier</a>
              </li>
              <li>
                <a href="collapsible.html">Stock Entry</a>
              </li>
              <li>
                <a href="collapsible.html">Reports</a>
              </li>
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
