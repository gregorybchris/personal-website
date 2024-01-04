import "./styles/Home.sass";

import { Link } from "react-router-dom";
import notesIcon from "../../images/icons/notes.svg";
import shoeIcon from "../../images/icons/shoe.svg";

export default function Home() {
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
          <Link to="/running">
            <div className="Home-content-info-box">
              <div className="Home-content-info-title">Running</div>
              <div className="Home-content-info-text">
                Check out some of my favorite running routes in Boston, Seattle, and Indianapolis.
              </div>
              <img className="Home-content-info-icon Home-content-info-shoe-icon" src={shoeIcon} alt="" />
            </div>
          </Link>
        </div>

        <div className="Home-content-info-wrap">
          <Link to="/music">
            <div className="Home-content-info-box">
              <div className="Home-content-info-title">Music</div>
              <div className="Home-content-info-text">
                The latest and greatest tunes from my public Spotify playlist.
              </div>
              <img className="Home-content-info-icon Home-content-info-notes-icon" src={notesIcon} alt="" />
            </div>
          </Link>
        </div>

        <div className="Home-content-info-wrap">
          <img
            className="Home-profile-image"
            alt="Profile"
            src="https://storage.googleapis.com/cgme/bio/profiles/mountains-profile-2.jpg"
          />
        </div>
      </div>
    </div>
  );
}
