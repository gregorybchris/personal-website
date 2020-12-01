import React from "react";

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
            Music has always been a huge part of my life from violin at an early
            age to learning piano and guitar on my own. Playing music with
            others is one of my greatest joys, but when that's not possible
            listening to music is the next best thing.
          </div>
          <div className="Music-about">
            Here's a collection of the stuff I'm listening to right now in no
            particular order. I periodically remove old stuff and update with
            fresh tunes, so check back for changes if you like what you hear!
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
