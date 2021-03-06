import React from "react";
import { Link } from "react-router-dom";

import "./styles/Home.sass";

// import linkIcon from "../../images/icons/link.svg";
import notesIcon from "../../images/icons/notes.svg";
import shoeIcon from "../../images/icons/shoe.svg";

interface HomeProps {}

interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <div className="Home">
        <div className="Home-section-welcome">
          <div className="Home-welcome-title">Hey there!</div>
          <div className="Home-welcome-text">
            Thanks for checking out my website. I mostly use this space to try out new web technologies and play with
            whatever data I can pull together. Take a look around and I hope you'll find something you like.
          </div>
        </div>

        <div className="Home-section-content-info">
          <div className="Home-content-info-wrap">
            <div className="Home-content-info-box">
              <div className="Home-content-info-title-wrap">
                <Link className="Home-content-info-title" to="/running">
                  Running
                </Link>
              </div>
              <div className="Home-content-info-text">
                Check out some of my favorite running routes in Boston, Seattle, and Indianapolis.
              </div>
              <Link className="Home-content-info-title" to="/running">
                <img className="Home-content-info-icon Home-content-info-shoe-icon" src={shoeIcon} alt=""></img>
              </Link>
            </div>
          </div>

          {/* <div className="Home-content-info-wrap">
            <div className="Home-content-info-box">
              <div className="Home-content-info-title-wrap">
                <Link className="Home-content-info-title" to="/links">
                  Links
                </Link>
              </div>
              <div className="Home-content-info-text">
                A collection of links to videos and articles online that I found insightful or novel.
              </div>
              <Link className="Home-content-info-title" to="/links">
                <img className="Home-content-info-icon Home-content-info-link-icon" src={linkIcon} alt=""></img>
              </Link>
            </div>
          </div> */}

          <div className="Home-content-info-wrap">
            <div className="Home-content-info-box">
              <div className="Home-content-info-title-wrap">
                <Link className="Home-content-info-title" to="/music">
                  Music
                </Link>
              </div>
              <div className="Home-content-info-text">
                The latest and greatest tunes from my public Spotify playlist.
              </div>
              <Link className="Home-content-info-title" to="/music">
                <img className="Home-content-info-icon Home-content-info-notes-icon" src={notesIcon} alt=""></img>
              </Link>
            </div>
          </div>

          <div className="Home-content-info-wrap">
            <img
              className="Home-profile-image"
              alt="Profile"
              src="https://chrisgregory.blob.core.windows.net/bio/profiles/mountains-profile-2.jpg"
            ></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
