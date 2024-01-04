import "./styles/Hidden.sass";

import { Link } from "react-router-dom";

export default function Hidden() {
  return (
    <div className="Hidden">
      <div className="Hidden-section">
        <div className="Hidden-title">Hidden Pages</div>
        <div className="Hidden-text">
          If you found your way here, I congratulate you. These pages are intended to be hidden.
        </div>
      </div>

      <div className="Hidden-section">
        <div className="Hidden-links">
          <Link to="/hidden/archive" className="Hidden-page-link">
            <div className="Hidden-page-link-box">Archive</div>
          </Link>
          <Link to="/hidden/blog-graph" className="Hidden-page-link">
            <div className="Hidden-page-link-box">Blog Graph</div>
          </Link>
          <Link to="/hidden/places" className="Hidden-page-link">
            <div className="Hidden-page-link-box">Places</div>
          </Link>
          <Link to="/hidden/opinion" className="Hidden-page-link">
            <div className="Hidden-page-link-box">Opinion</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
