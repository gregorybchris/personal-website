// import Radar from "react-d3-radar";
import "../styles/radar.css";

import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/requestUtilities";

import { RatingRadar } from "../components/RatingRadar";
import { Movie } from "../models/mediaModels";
import { SimpleLink } from "../widgets/SimpleLink";

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
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <div className="w-[300px] p-6 text-center" key={movie.name}>
                <div className="mb-10 w-full text-center">
                  <SimpleLink link={movie.link}>
                    <div className="font-noto font-bold">{movie.name}</div>

                    {movie.poster_url && (
                      <img
                        src={movie.poster_url}
                        alt={movie.name}
                        className="mt-2 inline-block w-40 rounded-md"
                      />
                    )}
                  </SimpleLink>
                </div>

                <RatingRadar scores={new Map(Object.entries(movie.scores))} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
