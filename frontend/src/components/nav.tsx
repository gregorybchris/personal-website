import {
  BooksIcon,
  CircuitryIcon,
  EnvelopeIcon,
  HouseIcon,
  MusicNotesIcon,
  SneakerMoveIcon,
} from "@phosphor-icons/react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../utilities/style-utilities";

function linkClassNameGetter(params: { isActive: boolean }) {
  const { isActive } = params;
  return cn(
    "text-md px-2 py-1 text-black/75 transition-all border-b",
    isActive ? "border-blue-500/80" : "border-transparent",
  );
}

export function Nav() {
  const iconSize = 24;
  return (
    <div className="flex flex-row flex-wrap justify-center gap-1 px-6 py-4 md:justify-start">
      <NavPageLink to="/" name="Home">
        <HouseIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
      {/* <NavPageLink to="/blog" name="Blog">
        <NotePencil size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink> */}
      <NavPageLink to="/projects" name="Projects">
        <CircuitryIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
      <NavPageLink to="/running" name="Running">
        <SneakerMoveIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
      <NavPageLink to="/books" name="Books">
        <BooksIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
      <NavPageLink to="/music" name="Music">
        <MusicNotesIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
      <NavPageLink to="/contact" name="Contact">
        <EnvelopeIcon size={iconSize} weight="duotone" color="#6283c0" />
      </NavPageLink>
    </div>
  );
}

interface NavPageLinkProps {
  to: string;
  name: string;
  children: React.ReactNode;
}

function NavPageLink(props: NavPageLinkProps) {
  const { to, name, children } = props;
  return (
    <NavLink to={to} className={linkClassNameGetter}>
      <div className="block md:hidden">{children}</div>
      <span className="hidden text-sm text-black/75 md:block">{name}</span>
    </NavLink>
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
