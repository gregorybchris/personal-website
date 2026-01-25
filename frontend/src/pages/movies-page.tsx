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
  posterUrl?: string;
}

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);

  useEffect(() => {
    const moviesQuery = makeQuery("media/movies");
    GET<Movie[]>(moviesQuery).then((queryResult) => {
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
    <div className="flex flex-col items-center justify-items-center gap-5 px-2">
      <div className="font-sanchez text-center text-3xl text-black/75">
        Movies
      </div>

      {movies.length === 0 && (
        <div className="text-center">Loading movies...</div>
      )}
      {movies.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap justify-center gap-x-1 gap-y-10">
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
                  >
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.name}
                        className="w-full rounded-lg border-4 border-transparent transition-all hover:border-sky/60 hover:shadow-md"
                      />
                    )}
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
