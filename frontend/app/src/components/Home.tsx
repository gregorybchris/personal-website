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
          <div className="Home-bio-section">
            <div className="Home-bio-text">More content:</div>
            <div className="Home-bio-text">
              - Videos and articles on my{" "}
              <Link className="Home-page-link" to="/blog">
                link blog
              </Link>
            </div>
            <div className="Home-bio-text">
              - New features{" "}
              <Link className="Home-page-link" to="/sandbox">
                sandbox
              </Link>
            </div>
            <div className="Home-bio-text">
              - Developer{" "}
              <a
                target="_blank"
                className="Home-page-link"
                href="https://documenter.getpostman.com/view/4051098/TVYM4Fzz"
              >
                API documentation
              </a>
            </div>
            <div className="Home-bio-text">
              - Fill out the{" "}
              <Link className="Home-page-link" to="/survey">
                survey of the day
              </Link>
            </div>
          </div>
          <div className="Home-bio-section">
            <img
              className="Home-bio-profile-image"
              src="https://chrisgregory.blob.core.windows.net/bio/profiles/mountains-profile-2.jpg"
            ></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
