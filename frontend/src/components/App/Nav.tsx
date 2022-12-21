import { NavLink } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./styles/Nav.sass";

function Nav() {
  const getLinkClassName = (baseClassName: string) => {
    return (params: { isActive: boolean }) => {
      const { isActive } = params;
      const currentLabel = isActive ? "current" : "";
      return `${baseClassName} ${currentLabel}`;
    };
  };

  return (
    <div className="Nav">
      <NavLink to="/" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Home</span>
      </NavLink>
      <NavLink to="/code" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Code</span>
      </NavLink>
      <NavLink to="/running" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Running</span>
      </NavLink>
      <NavLink to="/music" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Music</span>
      </NavLink>
      <NavLink to="/links" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Links</span>
      </NavLink>
      <NavLink to="/contact" className={getLinkClassName("Nav-page-link")}>
        <span className="Nav-page-link-text">Contact</span>
      </NavLink>
    </div>
  );
}

function withRouter(Component: any) {
  function ComponentWithRouterProp(props: any) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter(Nav);
