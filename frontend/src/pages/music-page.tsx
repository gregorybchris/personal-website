import { SimplePageLink } from "../components/simple-page-link";
import "../styles/common.css";

export function MusicPage() {
  return (
    <div className="p-8">
      <div className="mx-auto w-[90%] pb-2 text-center md:w-[80%]">
        <div className="block pb-3 font-sanchez text-3xl text-black/75">
          Music
        </div>
        <div className="mx-auto block w-[95%] py-3 text-black/75 md:w-[70%]">
          Spotify is getting scary good at recommending music. But a song from a
          human being always feels more personal. Even if the music you're into
          is totally different, shoot me a link with my{" "}
          <SimplePageLink to="/contact">Contact</SimplePageLink> page!
        </div>
      </div>

      <div className="mx-auto mt-3 w-[95%] max-w-[500px]">
        <iframe
          title="latest-music"
          className="w-full"
          src="https://open.spotify.com/embed/playlist/0oLhscbRKBJdfA5gfNQbe3"
          width="500"
          height="420"
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
}
