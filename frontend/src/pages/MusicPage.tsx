import "../styles/common.css";

import { Link } from "react-router-dom";

export function MusicPage() {
  return (
    <div className="p-8">
      <div className="w-[90%] md:w-[80%] mx-auto text-center pb-5">
        <div className="font-noto text-text-1 text-3xl font-bold block pb-3">Music</div>
        <div className="font-raleway text-text-1 block w-[95%] md:w-[70%] mx-auto py-3">
          Spotify is getting scary good at recommending music. But a song from a human being is an infinitely more
          precious gift. Even if you're into something totally different, shoot me a link with my{" "}
          <Link className="Common-simple-link" to="/contact">
            Contact
          </Link>{" "}
          page!
        </div>
        <div className="font-raleway text-text-1 block w-[95%] md:w-[70%] mx-auto py-3">
          Click on the album cover below to listen to full songs.
        </div>
      </div>

      <div className="w-[95%] max-w-[500px] mt-5 mx-auto">
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
