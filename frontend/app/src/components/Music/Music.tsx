import React from "react";
import { Link } from "react-router-dom";

import "./styles/Music.sass";

interface MusicProps {}

interface MusicState {}

class Music extends React.Component<MusicProps, MusicState> {
  render() {
    return (
      <div className="Music">
        <div className="Music-header">
          <div className="Music-title">Music</div>
          <div className="Music-about">
            Here's a collection of the songs I'm into right now in no particular order. If you have a music
            recommendation for me based on what you find here please send me a message with my{" "}
            <Link className="Common-simple-link" to="/contact">
              Contact
            </Link>{" "}
            page! I love getting new music from people with similar taste.
          </div>
          <div className="Music-about">
            To hear the full songs you'll need to log into a Spotify account either in your browser or in the Spotify
            desktop/mobile app.
          </div>
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
}

export default Music;
