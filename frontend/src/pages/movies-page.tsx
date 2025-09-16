import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RatingRadar } from "../components/rating-radar";
import { Tag } from "../components/tag";
import "../styles/radar.css";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface Movie {
  name: string;
  genres: string[];
  scores: {
    plot: number;
    characters: number;
    production: number;
    dialog: number;
  };
  link: string;
  poster_url?: string;
}

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);

  useEffect(() => {
    const moviesQuery = makeQuery("media/movies");
    GET(moviesQuery).then((queryResult) => {
      setMovies(queryResult);
    });
  }, []);

  function onClickGenre(genre: string) {
    if (currentGenre === genre) {
      setCurrentGenre(null);
    } else {
      setCurrentGenre(genre);
    }
  }

  return (
    <div>
      <div className="pb-5 text-center">
        <div className="pb-3 font-sanchez text-3xl text-black/75">Movies</div>
        <div className="py-3 text-black/75">Some great movies!</div>
      </div>

      {movies.length === 0 && (
        <div className="text-center">Loading movies...</div>
      )}
      {movies.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap justify-center gap-x-1 gap-y-8">
            {movies
              .filter(
                (movie) => !currentGenre || movie.genres.includes(currentGenre),
              )
              .map((movie) => (
                <div
                  className="flex w-[260px] flex-col items-center gap-1"
                  key={movie.name}
                >
                  <Link
                    to={movie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-1 py-2 hover:bg-black/5"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      {movie.poster_url && (
                        <img
                          src={movie.poster_url}
                          alt={movie.name}
                          className="inline-block w-full rounded-md"
                        />
                      )}

                      <div className="font-sanchez font-bold text-accent">
                        {movie.name}
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-row justify-center gap-3">
                    {movie.genres.map((genre) => (
                      <Tag
                        key={genre}
                        tag={genre}
                        onClick={onClickGenre}
                        selected={currentGenre === genre}
                      />
                    ))}
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
