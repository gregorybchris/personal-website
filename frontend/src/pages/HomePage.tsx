import { MusicNotes, SneakerMove } from "@phosphor-icons/react";

import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="bg-background py-10">
      <div className="w-[70%] py-2 mx-auto">
        <div className="font-noto font-bold text-[40px] text-text-1 block pb-4 ">Hey there!</div>
        <div className="font-raleway tracking-wide text-lg text-text-1 leading-6">
          Thanks for checking out my website. I mostly use this space to try out new web technologies and play with
          whatever data I can pull together. Take a look around and I hope you'll find something you like.
        </div>
      </div>

      <div className="text-center w-[100%] md:w-[80%] mx-auto py-5">
        <div className="inline-block align-middle my-4 mx-8">
          <Link to="/running">
            <div className="w-[300px] h-[200px] border-2 border-accent p-5 transition-all hover:border-accent-focus">
              <div className="flex flex-row justify-between items-center">
                <div className="text-text-1 font-bold text-lg font-noto border-b border-accent">Running</div>
                <SneakerMove size={40} weight="light" color="#6283C0" />
              </div>
              <div className="font-raleway text-left text-text-2 block text-md pt-4">
                Check out some of my favorite running routes in Boston, Seattle, and Indianapolis.
              </div>
            </div>
          </Link>
        </div>

        <div className="inline-block align-middle my-4 mx-8">
          <Link to="/music">
            <div className="w-[300px] h-[200px] border-2 border-accent p-5 transition-all hover:border-accent-focus">
              <div className="flex flex-row justify-between items-center">
                <div className="text-text-1 font-bold text-lg font-noto border-b border-accent">Music</div>
                <MusicNotes size={40} weight="light" color="#6283C0" />
              </div>
              <div className="font-raleway text-left text-text-2 block text-md pt-4">
                The latest and greatest tunes from my public Spotify playlist.
              </div>
            </div>
          </Link>
        </div>

        <div className="inline-block align-middle my-4 mx-10">
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
