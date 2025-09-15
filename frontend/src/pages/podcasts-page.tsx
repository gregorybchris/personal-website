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
    <div>
      <div className="pb-5 text-center">
        <div className="pb-3 font-noto text-3xl font-bold text-text-1">
          Podcasts
        </div>
        <div className="py-3 font-raleway text-text-1">
          Some great podcasts!
        </div>
      </div>

      {podcasts.length == 0 && <div>Loading podcasts...</div>}
      {podcasts.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {podcasts.map((podcast) => (
              <div className="w-[300px] p-6 text-center" key={podcast.name}>
                <div className="mb-10 flex w-full flex-col items-center space-y-3 text-center">
                  <SimpleLink link={podcast.apple_link}>
                    <div className="font-noto font-bold">{podcast.name}</div>

                    <img
                      src={`https://static.pocketcasts.com/discover/images/webp/480/${podcast.pocket_casts_id}.webp`}
                      alt={podcast.name}
                      className="mt-2 inline-block w-40 rounded-md"
                    />
                  </SimpleLink>
                </div>

                <RatingRadar scores={new Map(Object.entries(podcast.scores))} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
