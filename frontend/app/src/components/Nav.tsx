import React from "react";
import { Link, withRouter } from "react-router-dom";

import "./Nav.css";

function Nav() {
  return (
    <div className="Nav">
      <Link className="Nav-page-link" to="/">
        <span className="Nav-page-link-text">Home</span>
      </Link>
      <Link className="Nav-page-link" to="/projects">
        <span className="Nav-page-link-text">Projects</span>
      </Link>
      <Link className="Nav-page-link" to="/contact">
        <span className="Nav-page-link-text">Contact</span>
      </Link>
    </div>
  );
}

export default withRouter(Nav);
