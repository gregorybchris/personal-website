import "../styles/radar.css";

import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import Radar from "react-d3-radar";
import { YouTubeChannel } from "../models/mediaModels";

export function YouTubeChannelsPage() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  useEffect(() => {
    const channelsQuery = makeQuery("media/youtube");
    GET(channelsQuery).then((queryResult) => {
      console.log(queryResult);
      setChannels(queryResult);
    });
  }, []);

  return (
    <div>
      <div className="pb-5 text-center">
        <div className="pb-3 font-noto text-3xl font-bold text-text-1">
          YouTube Channels
        </div>
        <div className="py-3 font-raleway text-text-1">
          I watch a lot of YouTube
        </div>
      </div>

      {channels.length == 0 && <div>Loading channels...</div>}
      {channels.length > 0 && (
        <div className="">
          <div className="grid md:grid-cols-3 lg:grid-cols-5">
            {channels.map((show) => (
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
