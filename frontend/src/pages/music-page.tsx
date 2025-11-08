import { useState } from "react";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { SimplePageLink } from "../components/simple-page-link";
import { cn } from "../utilities/style-utilities";

export function MusicPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <PageTitle>Music</PageTitle>

        <div className="max-w-2xl text-center text-sm text-balance text-black/60 md:text-base">
          Spotify is getting scary good at recommending music, but to me a song
          recommended by a person always feels more meaningful. Even if the
          music you're into is totally different, shoot me a link with my{" "}
          <SimplePageLink to="/contact">Contact</SimplePageLink> page.
        </div>
      </div>

      <div className="relative w-full max-w-[600px]">
        {isLoading && (
          <div className="flex h-[420px] items-center justify-center rounded-2xl border-4 border-white/60 shadow-md">
            <Loader text="Loading playlist" />
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-2xl border-4 border-white/60 shadow-md",
            isLoading && "hidden",
          )}
        >
          <iframe
            title="latest-music"
            className="w-full"
            src="https://open.spotify.com/embed/playlist/0oLhscbRKBJdfA5gfNQbe3"
            width="500"
            height="420"
            allow="encrypted-media"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
