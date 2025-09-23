import { useEffect, useState } from "react";
import { RatingRadar } from "../components/rating-radar";
import { SimpleLink } from "../components/simple-link";
import "../styles/radar.css";
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
  apple_link: string;
  pocket_casts_link: string;
  pocket_casts_id: string;
}

export function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const podcastsQuery = makeQuery("media/podcasts");
    GET(podcastsQuery).then((queryResult) => {
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
          <div className="flex flex-row flex-wrap justify-center gap-6">
            {podcasts.map((podcast) => (
              <div
                className="flex w-[260px] flex-col items-center gap-3"
                key={podcast.name}
              >
                <SimpleLink link={podcast.apple_link}>
                  <div className="flex w-full flex-col items-center gap-2 text-center">
                    <div className="font-sanchez font-bold">{podcast.name}</div>

                    <img
                      src={`https://static.pocketcasts.com/discover/images/webp/480/${podcast.pocket_casts_id}.webp`}
                      alt={podcast.name}
                      className="w-full rounded-md"
                    />
                  </div>
                </SimpleLink>

                <RatingRadar scores={new Map(Object.entries(podcast.scores))} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
