import { PageTitle } from "../components/page-title";
import { SimplePageLink } from "../components/simple-page-link";

export function MusicPage() {
  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Music</PageTitle>

        <div className="text-center text-balance text-black/75 md:w-[70%]">
          Spotify is getting scary good at recommending music, but I think a
          song from a human being always feels more personal. Even if the music
          you're into is totally different, shoot me a link with my{" "}
          <SimplePageLink to="/contact">Contact</SimplePageLink> page!
        </div>
      </div>

      <div className="w-full max-w-[600px]">
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
