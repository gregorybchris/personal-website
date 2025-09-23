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
    <div className="flex flex-col items-center justify-items-center gap-5 px-2">
      <div className="font-sanchez text-center text-3xl text-black/75">
        TV Shows
      </div>

      {shows.length === 0 && (
        <div className="text-center">Loading TV shows...</div>
      )}
      {shows.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap justify-center gap-x-1 gap-y-8">
            {shows
              .filter(
                (show) => !currentGenre || show.genres.includes(currentGenre),
              )
              .map((show) => (
                <div
                  className="flex w-[260px] flex-col items-center gap-1"
                  key={show.name}
                >
                  <Link
                    to={show.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-1 py-2 hover:bg-black/5"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      {show.poster_url && (
                        <img
                          src={show.poster_url}
                          alt={show.name}
                          className="w-full rounded-md"
                        />
                      )}

                      <div className="font-sanchez text-sky font-bold">
                        {show.name}
                      </div>
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

                  <RatingRadar scores={new Map(Object.entries(show.scores))} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
