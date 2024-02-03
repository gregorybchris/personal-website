import "../styles/radar.css";

import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import Radar from "react-d3-radar";
import { SimpleLink } from "../widgets/SimpleLink";
import { YouTubeChannel } from "../models/mediaModels";

export function YouTubeChannelsPage() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  useEffect(() => {
    const channelsQuery = makeQuery("media/youtube");
    GET(channelsQuery).then((queryResult) => {
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
          Some great YouTube channels!
        </div>
      </div>

      {channels.length == 0 && <div>Loading channels...</div>}
      {channels.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {channels.map((channel) => (
              <div className="w-[300px] p-6 text-center" key={channel.name}>
                <div className="mb-10 w-full text-center">
                  <SimpleLink link={channel.link}>
                    <div className="font-noto font-bold">{channel.name}</div>
                  </SimpleLink>
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
                            productionScore: channel.scores.production,
                            personalityScore: channel.scores.personality,
                            informationScore: channel.scores.information,
                            consistencyScore: channel.scores.consistency,
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
