import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RatingRadar } from "../components/rating-radar";
import { Tag } from "../components/tag";
import "../styles/radar.css";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface TvShow {
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

export function TvShowsPage() {
  const [shows, setShows] = useState<TvShow[]>([]);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);

  useEffect(() => {
    const showsQuery = makeQuery("media/tv");
    GET(showsQuery).then((queryResult) => {
      setShows(queryResult);
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
        <div className="pb-3 font-sanchez text-3xl text-black/75">TV Shows</div>
        <div className="py-3 text-black/75">Some great TV shows!</div>
      </div>

      {shows.length == 0 && (
        <div className="text-center">Loading TV shows...</div>
      )}
      {shows.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {shows
              .filter(
                (show) => !currentGenre || show.genres.includes(currentGenre),
              )
              .map((show) => (
                <div
                  className="flex w-[300px] flex-col gap-1 p-6 text-center"
                  key={show.name}
                >
                  <Link
                    to={show.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-1 py-4 hover:bg-black/5"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="font-sanchez font-bold text-accent">
                        {show.name}
                      </div>

                      {show.poster_url && (
                        <img
                          src={show.poster_url}
                          alt={show.name}
                          className="inline-block w-40 rounded-md"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-row justify-center gap-3">
                    {show.genres.map((genre) => (
                      <Tag
                        key={genre}
                        tag={genre}
                        onClick={onClickGenre}
                        selected={currentGenre === genre}
                      />
                    ))}
                  </div>

                  <div className="mb-6 mt-8">
                    <RatingRadar
                      scores={new Map(Object.entries(show.scores))}
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
