import "../styles/common.css";

import { Link } from "react-router-dom";

export function MusicPage() {
  return (
    <div className="p-8">
      <div className="mx-auto w-[90%] pb-5 text-center md:w-[80%]">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Music
        </div>
        <div className="mx-auto block w-[95%] py-3 font-raleway text-text-1 md:w-[70%]">
          Spotify is getting scary good at recommending music. But a song from a
          human being is an infinitely more precious gift. Even if you're into
          something totally different, shoot me a link with my{" "}
          <Link className="Common-simple-link" to="/contact">
            Contact
          </Link>{" "}
          page!
        </div>
        <div className="mx-auto block w-[95%] py-3 font-raleway text-text-1 md:w-[70%]">
          Click on the album cover below to listen to full songs.
        </div>
      </div>

      <div className="mx-auto mt-5 w-[95%] max-w-[500px]">
        <iframe
          title="latest-music"
          className="w-full"
          src="https://open.spotify.com/embed/playlist/0oLhscbRKBJdfA5gfNQbe3"
          width="500"
          height="380"
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
}
