import { MusicNotes, SneakerMove } from "@phosphor-icons/react";

import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="bg-background py-10">
      <div className="mx-auto w-[70%] py-2">
        <div className="block pb-4 font-noto text-[40px] font-bold text-text-1">
          Hey there!
        </div>
        <div className="font-raleway text-lg leading-6 tracking-wide text-text-1">
          Thanks for checking out my website. I mostly use this space to try out
          new web technologies and play with whatever data I can pull together.
          Take a look around and I hope you'll find something you like.
        </div>
      </div>

      <div className="mx-auto w-[100%] py-5 text-center md:w-[80%]">
        <div className="mx-8 my-4 inline-block align-middle">
          <Link to="/running">
            <div className="h-[200px] w-[300px] border-2 border-accent p-5 transition-all hover:border-accent-focus">
              <div className="flex flex-row items-center justify-between">
                <div className="border-b border-accent font-noto text-lg font-bold text-text-1">
                  Runs
                </div>
                <SneakerMove size={40} weight="light" color="#6283c0" />
              </div>
              <div className="text-md block pt-4 text-left font-raleway text-text-2">
                Check out some of my favorite running routes in Boston, Seattle,
                and Indianapolis.
              </div>
            </div>
          </Link>
        </div>

        <div className="mx-8 my-4 inline-block align-middle">
          <Link to="/music">
            <div className="h-[200px] w-[300px] border-2 border-accent p-5 transition-all hover:border-accent-focus">
              <div className="flex flex-row items-center justify-between">
                <div className="border-b border-accent font-noto text-lg font-bold text-text-1">
                  Music
                </div>
                <MusicNotes size={40} weight="light" color="#6283c0" />
              </div>
              <div className="text-md block pt-4 text-left font-raleway text-text-2">
                Listen to a playlist of the songs I've been listening to
                recently.
              </div>
            </div>
          </Link>
        </div>

        <div className="mx-10 my-4 inline-block align-middle">
          <img
            className="w-[300px] rounded-full"
            alt="Profile"
            src="https://storage.googleapis.com/cgme/bio/profiles/mountains-profile-2.jpg"
          />
        </div>
      </div>
    </div>
  );
}
