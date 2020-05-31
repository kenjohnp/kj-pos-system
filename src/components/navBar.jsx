import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-wrapper green">
        <a
          href="#"
          data-target="slide-out"
          className="sidenav-trigger show-on-large"
        >
          <i className="material-icons">menu</i>
        </a>
        <div className="container">
          <a href="#" className="brand-logo">
            KJ POS
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <NavLink to="/users">Users</NavLink>
            </li>
            <li>
              <a href="badges.html">Products</a>
            </li>
            <li>
              <a href="collapsible.html">Categories</a>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
