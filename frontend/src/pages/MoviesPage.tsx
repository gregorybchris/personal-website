import "../styles/radar.css";

import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import { Movie } from "../models/mediaModels";
import Radar from "react-d3-radar";

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const moviesQuery = makeQuery("media/movies");
    GET(moviesQuery).then((queryResult) => {
      setMovies(queryResult);
    });
  }, []);

  return (
    <div>
      <div className="pb-5 text-center">
        <div className="pb-3 font-noto text-3xl font-bold text-text-1">
          Movies
        </div>
        <div className="py-3 font-raleway text-text-1">Some great movies!</div>
      </div>

      {movies.length == 0 && <div>Loading movies...</div>}
      {movies.length > 0 && (
        <div className="">
          <div className="grid md:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <div className="w-[300px] p-6 text-center" key={movie.name}>
                <div className="mb-10 w-full text-center">
                  <div className="font-noto font-bold">{movie.name}</div>
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
                        { key: "dialog_score", label: "Dialog" },
                        { key: "characters_score", label: "Characters" },
                        { key: "plot_score", label: "Plot" },
                      ],
                      sets: [
                        {
                          key: "me",
                          label: "My Scores",
                          values: {
                            production_score: movie.production_score,
                            dialog_score: movie.dialog_score,
                            characters_score: movie.characters_score,
                            plot_score: movie.plot_score,
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
