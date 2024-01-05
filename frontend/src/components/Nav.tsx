import { useLocation, useNavigate, useParams } from "react-router-dom";

import { NavLink } from "react-router-dom";
import { cn } from "../utilities/styleUtilities";

function Nav() {
  function getLinkClassName() {
    return (params: { isActive: boolean }) => {
      const { isActive } = params;
      return cn(
        "font-raleway text-md pt-2 px-2 pb-1 mx-1 mb-2 inline-block text-text-1 transition-all border-b border-transparent hover:text-text-3",
        isActive && "border-accent"
      );
    };
  }

  return (
    <div className="bg-background py-3 px-6 text-center md:text-left">
      <div className="inline-block">
        <NavLink to="/" className={getLinkClassName()}>
          Home
        </NavLink>
        <NavLink to="/code" className={getLinkClassName()}>
          Code
        </NavLink>
        <NavLink to="/running" className={getLinkClassName()}>
          Running
        </NavLink>
        <NavLink to="/music" className={getLinkClassName()}>
          Music
        </NavLink>
      </div>
      <div className="inline-block">
        <NavLink to="/links" className={getLinkClassName()}>
          Links
        </NavLink>
        <NavLink to="/books" className={getLinkClassName()}>
          Books
        </NavLink>
        <NavLink to="/contact" className={getLinkClassName()}>
          Contact
        </NavLink>
      </div>
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
