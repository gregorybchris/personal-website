import {
  BooksIcon,
  CircuitryIcon,
  EnvelopeIcon,
  MusicNotesIcon,
  NotePencilIcon,
  SneakerMoveIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import vaseIcon from "../assets/icons/vase.svg";

export function HomePage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <div className="font-sanchez flex w-full flex-col items-center text-[40px] text-black/70">
        Hey there!
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="flex flex-row items-center gap-5 py-4 md:gap-20">
          <div className="flex flex-col flex-wrap items-start gap-5">
            <PageLink to="/blog" name="Blog">
              <NotePencilIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
            <PageLink to="/projects" name="Projects">
              <CircuitryIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
            <PageLink to="/running" name="Running">
              <SneakerMoveIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
            <PageLink to="/books" name="Books">
              <BooksIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
            <PageLink to="/music" name="Music">
              <MusicNotesIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
            <PageLink to="/pottery" name="Pottery">
              <img src={vaseIcon} className="size-6" />
            </PageLink>
            <PageLink to="/contact" name="Contact">
              <EnvelopeIcon size={24} weight="duotone" color="#6283c0" />
            </PageLink>
          </div>

          <img
            className="w-[200px] rounded-full md:w-[350px]"
            alt="Profile"
            src="https://storage.googleapis.com/cgme/bio/profiles/mountains-profile-2.jpg"
          />
        </div>
      </div>
    </div>
  );
}

interface PageLinkProps {
  to: string;
  name: React.ReactNode;
  children: React.ReactNode;
}

function PageLink({ to, name, children }: PageLinkProps) {
  return (
    <Link to={to}>
      <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/5 md:pr-4 md:pl-3">
        {children}
        <div className="font-sanchez text-sm md:text-lg">{name}</div>
      </div>
    </Link>
  );
}
