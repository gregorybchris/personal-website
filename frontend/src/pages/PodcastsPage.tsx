import "../styles/radar.css";

import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/requestUtilities";

import Radar from "react-d3-radar";
import { Podcast } from "../models/mediaModels";
import { SimpleLink } from "../widgets/SimpleLink";

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
                  </SimpleLink>

                  <img
                    src={`https://static.pocketcasts.com/discover/images/webp/480/${podcast.pocket_casts_id}.webp`}
                    alt={podcast.name}
                    className="size-40 rounded-md"
                  />
                </div>

                <div className="radar-chart mx-auto block h-32 w-32">
                  <Radar
                    className=""
                    width={100}
                    height={100}
                    padding={0}
                    domainMax={10}
                    style={{
                      numRings: 5,
                    }}
                    data={{
                      variables: [
                        { key: "productionScore", label: "Production" },
                        { key: "personalityScore", label: "Personality" },
                        { key: "informationScore", label: "Information" },
                        { key: "consistencyScore", label: "Consistency" },
                      ],
                      sets: [
                        {
                          key: "me",
                          label: "My Scores",
                          values: {
                            productionScore: podcast.scores.production,
                            personalityScore: podcast.scores.personality,
                            informationScore: podcast.scores.information,
                            consistencyScore: podcast.scores.consistency,
                          },
                        },
                      ],
                    }}
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
