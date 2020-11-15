import React from "react";
import { NavLink, withRouter } from "react-router-dom";

import "./Nav.css";

function Nav() {
  return (
    <div className="Nav">
      <NavLink className="Nav-page-link" to="/" exact activeClassName="current">
        <span className="Nav-page-link-text">Home</span>
      </NavLink>

      <NavLink
        className="Nav-page-link"
        to="/code"
        exact
        activeClassName="current"
      >
        <span className="Nav-page-link-text">Code</span>
      </NavLink>

      <NavLink
        className="Nav-page-link"
        to="/opinion"
        exact
        activeClassName="current"
      >
        <span className="Nav-page-link-text">Opinion</span>
      </NavLink>

      <NavLink className="Nav-page-link" to="/links" activeClassName="current">
        <span className="Nav-page-link-text">Links</span>
      </NavLink>

      <NavLink
        className="Nav-page-link"
        to="/contact"
        activeClassName="current"
      >
        <span className="Nav-page-link-text">Contact</span>
      </NavLink>
    </div>
  );
}

export default withRouter(Nav);
