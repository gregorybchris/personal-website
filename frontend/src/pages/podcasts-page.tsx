import { useEffect, useState } from "react";
import { RatingRadar } from "../components/rating-radar";
import { SimpleLink } from "../components/simple-link";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface Podcast {
  name: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  appleLink: string;
  pocketCastsLink: string;
  pocketCastsId: string;
}

export function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const podcastsQuery = makeQuery("media/podcasts");
    GET<Podcast[]>(podcastsQuery).then((queryResult) => {
      setPodcasts(queryResult);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center gap-5 px-2">
      <div className="font-sanchez text-center text-3xl text-black/75">
        Podcasts
      </div>

      {podcasts.length === 0 && <div>Loading podcasts...</div>}
      {podcasts.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-10">
            {podcasts.map((podcast) => (
              <div
                className="flex w-[260px] flex-col items-center overflow-hidden rounded-xl border border-black/10 bg-white/50 shadow-sm"
                key={podcast.name}
              >
                <SimpleLink link={podcast.appleLink}>
                  <img
                    src={`https://static.pocketcasts.com/discover/images/webp/480/${podcast.pocketCastsId}.webp`}
                    alt={podcast.name}
                    className="w-full transition-all hover:opacity-90"
                  />
                </SimpleLink>

                <div className="py-4">
                  <RatingRadar
                    scores={new Map(Object.entries(podcast.scores))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
