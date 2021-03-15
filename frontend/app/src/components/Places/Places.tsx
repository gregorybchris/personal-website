import React from "react";

import "./styles/Places.sass";

interface PlacesProps {}

interface PlacesState {}

class Places extends React.Component<PlacesProps, PlacesState> {
  render() {
    return (
      <div className="Places">
        <div className="Places-header">
          <div className="Places-title">Places</div>
          <div className="Places-about">
            I'm far from a world traveler, but of the places I have been here are some of my favorites.
          </div>
        </div>
        <div className="Places-maps">
          <iframe
            className="Places-map"
            title="Seattle"
            src="https://www.google.com/maps/d/u/0/embed?mid=1YpGkcgAv-I4_fexKFwTl1laE-0o21aiU"
            width="640"
            height="480"
          ></iframe>
          <iframe
            className="Places-map"
            title="Indianapolis"
            src="https://www.google.com/maps/d/u/0/embed?mid=19yXbLVzXqtMyhf3nLS0WVXfkONPjXTsS"
            width="640"
            height="480"
          ></iframe>
          <iframe
            className="Places-map"
            title="San Diego"
            src="https://www.google.com/maps/d/u/0/embed?mid=12DIDfRXi5ud9-nIsVJBTEInH-xQ0NNnf"
            width="640"
            height="480"
          ></iframe>
        </div>
      </div>
    );
  }
}

export default Places;
