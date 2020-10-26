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
            <div className="Home-bio-interest-text">
              Thanks for checking out my website. I mostly use this space to try
              out new web technologies and play with whatever data I can pull
              together. Take a look around and I hope you'll find something you
              like.
            </div>
            <br />
            <hr />
            <br />
            <div className="Home-bio-interest-text">More content:</div>
            <div className="Home-bio-interest-text">
              - Videos and articles on my{" "}
              <Link className="Home-page-link" to="/blog">
                link blog
              </Link>
            </div>
            <div className="Home-bio-interest-text">
              - New features{" "}
              <Link className="Home-page-link" to="/sandbox">
                sandbox
              </Link>
            </div>
          </div>
          {/* <div className="Home-bio-section">
            <div className="Home-bio-interest-section">
              <span className="Home-bio-interest-header">Software:</span>
              <span className="Home-bio-interest-text">
                I wrote my first computer program in 2010 as a freshman in high
                school and I was hooked.
              </span>
            </div>
            <div className="Home-bio-interest-section">
              <span className="Home-bio-interest-header">Neuroscience:</span>
              <span className="Home-bio-interest-text"></span>
            </div>
            <div className="Home-bio-interest-section">
              <span className="Home-bio-interest-header">Philosophy:</span>
              <span className="Home-bio-interest-text"></span>
            </div>
            <div className="Home-bio-interest-section">
              <span className="Home-bio-interest-header">Running:</span>
              <span className="Home-bio-interest-text">
                I ran track and cross country in high school and college.
              </span>
            </div>
            <div className="Home-bio-interest-section">
              <span className="Home-bio-interest-header">Music:</span>
              <span className="Home-bio-interest-text">
                Violin starting when I was 7, piano at 10, and guitar at 13.
              </span>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Home;
