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

                <RatingRadar scores={new Map(Object.entries(channel.scores))} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
