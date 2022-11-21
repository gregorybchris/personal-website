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
              <img className="Home-content-info-icon Home-content-info-shoe-icon" src={shoeIcon} alt="" />
            </Link>
          </div>
        </div>

        <div className="Home-content-info-wrap">
          <div className="Home-content-info-box">
            <div className="Home-content-info-title-wrap">
              <Link className="Home-content-info-title" to="/music">
                Music
              </Link>
            </div>
            <div className="Home-content-info-text">The latest and greatest tunes from my public Spotify playlist.</div>
            <Link className="Home-content-info-title" to="/music">
              <img className="Home-content-info-icon Home-content-info-notes-icon" src={notesIcon} alt="" />
            </Link>
          </div>
        </div>

        <div className="Home-content-info-wrap">
          <img
            className="Home-profile-image"
            alt="Profile"
            src="https://storage.googleapis.com/chris-gregory/bio/profiles/mountains-profile-2.jpg"
          />
        </div>
      </div>
    </div>
  );
}
