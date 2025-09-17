import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../utilities/style-utilities";

export function Nav() {
  function getLinkClassName() {
    return (params: { isActive: boolean }) => {
      const { isActive } = params;
      return cn(
        "text-md px-2 py-1 text-black/75 transition-all border-b",
        isActive ? "border-blue-500/80" : "border-transparent",
      );
    };
  }

  return (
    <div className="px-6 py-3 text-center md:text-left">
      <div className="flex flex-row items-center gap-1">
        <NavLink to="/" className={getLinkClassName()}>
          Home
        </NavLink>
        {/* <NavLink to="/blog" className={getLinkClassName()}>
          Blog
        </NavLink> */}
        <NavLink to="/projects" className={getLinkClassName()}>
          Projects
        </NavLink>
        <NavLink to="/running" className={getLinkClassName()}>
          Running
        </NavLink>
        <NavLink to="/books" className={getLinkClassName()}>
          Books
        </NavLink>
        <NavLink to="/music" className={getLinkClassName()}>
          Music
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
