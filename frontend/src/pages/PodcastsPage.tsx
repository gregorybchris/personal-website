import "../styles/radar.css";

import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import { Podcast } from "../models/mediaModels";
import Radar from "react-d3-radar";

export function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const podcastsQuery = makeQuery("media/podcasts");
    GET(podcastsQuery).then((queryResult) => {
      console.log(queryResult);
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
          I listen to a lot of podcasts
        </div>
      </div>

      {podcasts.length == 0 && <div>Loading podcasts...</div>}
      {podcasts.length > 0 && (
        <div className="">
          <div className="grid md:grid-cols-3 lg:grid-cols-5">
            {podcasts.map((show) => (
              <div className="w-[300px] p-6 text-center" key={show.name}>
                <div className="mb-10 w-full text-center">
                  <div className="font-noto font-bold">{show.name}</div>
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
                        { key: "production_score", label: "Production" },
                        { key: "personality_score", label: "Personality" },
                        { key: "information_score", label: "Information" },
                        { key: "consistency_score", label: "Consistency" },
                      ],
                      sets: [
                        {
                          key: "me",
                          label: "My Scores",
                          values: {
                            production_score: show.production_score,
                            personality_score: show.personality_score,
                            information_score: show.information_score,
                            consistency_score: show.consistency_score,
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
