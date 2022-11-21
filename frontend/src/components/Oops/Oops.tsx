import "./styles/Oops.sass";

export default function Oops() {
  return (
    <div className="Oops">
      <div className="Oops-section">
        <div className="Oops-title">Oops! :/</div>
        <div className="Oops-text">Somehow you've ended up on a page that doesn't exist...</div>
      </div>
      <div className="Oops-image-wrap">
        <img
          object-fit="cover"
          alt="oops"
          className="Oops-image"
          src="https://storage.googleapis.com/chris-gregory/bio/profiles/wide-eyes-profile.jpg"
        />
      </div>
    </div>
  );
}
