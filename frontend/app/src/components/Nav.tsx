import React from "react";
import { Link, withRouter } from "react-router-dom";

import "./Nav.css";

function Nav() {
  return (
    <div className="Nav">
      <div className="Nav-page-item">
        <Link className="Nav-page-link" to="/">
          Home
        </Link>
      </div>
      <div className="Nav-page-item">
        <Link className="Nav-page-link" to="/projects">
          Projects
        </Link>
      </div>
      <div className="Nav-page-item">
        <Link className="Nav-page-link" to="/contact">
          Contact
        </Link>
      </div>
    </div>
  );
}

export default withRouter(Nav);
