import "../styles/radar.css";

import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/requestUtilities";

import Radar from "react-d3-radar";
import { TvShow } from "../models/mediaModels";
import { SimpleLink } from "../widgets/SimpleLink";

export function TvShowsPage() {
  const [shows, setShows] = useState<TvShow[]>([]);

  useEffect(() => {
    const showsQuery = makeQuery("media/tv");
    GET(showsQuery).then((queryResult) => {
      queryResult;
      setShows(queryResult);
    });
  }, []);

  return (
    <div>
      <div className="pb-5 text-center">
        <div className="pb-3 font-noto text-3xl font-bold text-text-1">
          TV Shows
        </div>
        <div className="py-3 font-raleway text-text-1">
          Some great TV shows!
        </div>
      </div>

      {shows.length == 0 && <div>Loading shows...</div>}
      {shows.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {shows.map((show) => (
              <div className="w-[300px] p-6 text-center" key={show.name}>
                <div className="mb-10 w-full text-center">
                  <SimpleLink link={show.link}>
                    <div className="font-noto font-bold">{show.name}</div>
                  </SimpleLink>

                  <img
                    src={show.poster_url}
                    alt={show.name}
                    className="inline-block w-40 rounded-md pt-2"
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
                        { key: "dialogScore", label: "Dialog" },
                        { key: "charactersScore", label: "Characters" },
                        { key: "plotScore", label: "Plot" },
                      ],
                      sets: [
                        {
                          key: "me",
                          label: "My Scores",
                          values: {
                            productionScore: show.scores.production,
                            dialogScore: show.scores.dialog,
                            charactersScore: show.scores.characters,
                            plotScore: show.scores.plot,
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
