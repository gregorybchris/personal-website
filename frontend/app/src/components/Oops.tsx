import React from "react";

import "./Oops.sass";

export interface OopsProps {}

export interface OopsState {}

class Oops extends React.Component<OopsProps, OopsState> {
  render() {
    return (
      <div className="Oops">
        <div className="Oops-section">
          <div className="Oops-title">Oops! :/</div>
          <div className="Oops-text">
            Somehow you've ended up on a page that doesn't exist...
          </div>
        </div>
        <div className="Oops-image-wrap">
          <img
            object-fit="cover"
            className="Oops-image"
            src="https://chrisgregory.blob.core.windows.net/bio/profiles/wide-eyes-profile.jpg"
          ></img>
        </div>
      </div>
    );
  }
}

export default Oops;
