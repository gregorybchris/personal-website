import {
  Books,
  Circuitry,
  Envelope,
  MusicNotes,
  SneakerMove,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-[30px] py-12 md:px-[130px] md:py-16 lg:px-[200px]">
      <div className="flex w-full flex-col items-center font-sanchez text-[40px] text-black/70">
        Hey there!
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="flex flex-row items-center gap-5 py-4 md:gap-16">
          <div className="flex flex-col flex-wrap items-start gap-5">
            {/* <Link to="/blog">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <NotePencil size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Blog</div>
              </div>
            </Link> */}

            <Link to="/projects">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <Circuitry size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Projects</div>
              </div>
            </Link>

            <Link to="/running">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <SneakerMove size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Running</div>
              </div>
            </Link>

            <Link to="/books">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <Books size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Books</div>
              </div>
            </Link>

            <Link to="/music">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <MusicNotes size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Music</div>
              </div>
            </Link>

            <Link to="/contact">
              <div className="flex flex-row items-center gap-3 rounded px-2 py-1 transition-all hover:bg-black/[8%] md:pl-3 md:pr-4">
                <Envelope size={24} weight="duotone" color="#6283c0" />
                <div className="font-sanchez text-sm md:text-lg">Contact</div>
              </div>
            </Link>
          </div>

          <img
            className="w-[200px] rounded-full md:w-[300px]"
            alt="Profile"
            src="https://storage.googleapis.com/cgme/bio/profiles/mountains-profile-2.jpg"
          />
        </div>
      </div>
    </div>
  );
}
