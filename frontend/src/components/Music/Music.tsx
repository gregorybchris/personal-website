import "./styles/Music.sass";

import { Link } from "react-router-dom";

export default function Music() {
  return (
    <div className="Music">
      <div className="Music-header">
        <div className="Music-title">Music</div>
        <div className="Music-about">
          Spotify is getting scary good at recommending music. But a song from a human being is an infinitely more
          precious gift. Even if you're into something totally different, shoot me a link with my{" "}
          <Link className="Common-simple-link" to="/contact">
            Contact
          </Link>{" "}
          page!
        </div>
        <div className="Music-about">Click on the album cover below to listen to full songs.</div>
      </div>
      <div className="Music-spotify">
        <iframe
          title="latest-music"
          className="Music-spotify-iframe"
          src="https://open.spotify.com/embed/playlist/0oLhscbRKBJdfA5gfNQbe3"
          width="500"
          height="380"
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
}
