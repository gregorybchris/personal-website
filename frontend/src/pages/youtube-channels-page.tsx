import { useEffect, useState } from "react";
import { RatingRadar } from "../components/rating-radar";
import { SimpleLink } from "../components/simple-link";
import "../styles/radar.css";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface YouTubeChannel {
  name: string;
  category: string;
  scores: {
    production: number;
    personality: number;
    information: number;
    consistency: number;
  };
  link: string;
}

export function YouTubeChannelsPage() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  useEffect(() => {
    const channelsQuery = makeQuery("media/youtube_channels");
    GET(channelsQuery).then((queryResult) => {
      setChannels(queryResult);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center gap-5 px-2">
      <div className="font-sanchez text-center text-3xl text-black/75">
        YouTube Channels
      </div>

      {channels.length === 0 && <div>Loading channels...</div>}
      {channels.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {channels.map((channel) => (
              <div
                className="flex w-[300px] flex-col items-center gap-2 p-6"
                key={channel.name}
              >
                <div className="w-full text-center">
                  <SimpleLink link={channel.link}>
                    <div className="font-sanchez font-bold">{channel.name}</div>
                  </SimpleLink>
                </div>

                <RatingRadar scores={new Map(Object.entries(channel.scores))} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
