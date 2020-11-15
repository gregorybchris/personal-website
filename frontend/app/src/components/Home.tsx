import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="Home">
        <div className="Home-bio-wrap">
          <div className="Home-bio-header">Hey there!</div>

          <div className="Home-bio-section">
            <div className="Home-bio-text">
              Thanks for checking out my website. I mostly use this space to try
              out new web technologies and play with whatever data I can pull
              together. Take a look around and I hope you'll find something you
              like.
            </div>
          </div>
          <hr className="Home-bio-section-divider" />
          <div className="Home-bio-section"></div>
        </div>
      </div>
    );
  }
}

export default Home;
