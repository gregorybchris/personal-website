import React from "react";

import "./Music.css";

export default () => {
  return (
    <div className="Music">
      <div className="Music-spotify-wrap">
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
};
