import { useEffect, useState } from "react";
import { Tag } from "../components/Tag";
import { GET, makeQuery } from "../utilities/requestUtilities";
import { cn } from "../utilities/styleUtilities";

export interface Artist {
  name: string;
  genres: string[];
  scores: {
    musicality: number;
    production: number;
    consistency: number;
    personality: number;
  };
  link: string;
  image_link: string;
}

export function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    const artistsQuery = makeQuery("media/artists");
    GET(artistsQuery).then((artists: Artist[]) => {
      setArtists(artists);
      const genresSet = new Set<string>();
      artists.forEach((artist) => {
        artist.genres.forEach((genre) => genresSet.add(genre));
      });
      setAllGenres(Array.from(genresSet));
    });
  }, []);

  function onGenreClick(genre: string) {
    let newGenres: string[] = [];
    if (activeGenres.includes(genre)) {
      newGenres = activeGenres.filter((activeGenre) => activeGenre !== genre);
    } else {
      newGenres = [...activeGenres, genre];
    }
    setActiveGenres(newGenres);
  }

  return (
    <div className="grid justify-items-center pt-8 font-raleway">
      <div className="w-4/5">
        <div className="mb-5 text-center font-noto text-3xl font-bold text-text-1">
          Artists
        </div>
        <div className="mx-auto w-[95%] py-3 text-center text-text-1 md:w-[70%]">
          Some musical artists I like!
        </div>
      </div>

      <div className="mt-4 flex flex-row justify-center space-x-2">
        {allGenres.map((genre) => (
          <Tag
            key={genre}
            tag={genre}
            onClick={onGenreClick}
            active={activeGenres.includes(genre)}
          />
        ))}
      </div>

      <div className="grid w-4/5 grid-cols-1 justify-items-center pt-5 md:grid-cols-4 lg:grid-cols-6">
        {artists
          .filter(
            (artist) =>
              activeGenres.length == 0 ||
              activeGenres.every((tag) => artist.genres.includes(tag)),
          )
          .map((artist) => (
            <ArtistCard
              key={artist.name}
              artist={artist}
              onGenreClick={onGenreClick}
              activeGenres={activeGenres}
            />
          ))}
      </div>
    </div>
  );
}

interface ArtistCardProps {
  artist: Artist;
  onGenreClick: (genre: string) => void;
  activeGenres: string[];
}
export function ArtistCard({
  artist,
  onGenreClick,
  activeGenres,
}: ArtistCardProps) {
  const timestamp = Date.now();
  return (
    <div className={cn("px-2 py-3")}>
      <div className="mb-2 flex justify-center">
        <a href={artist.link} target="_blank" className="group">
          <img
            src={`${artist.image_link}?a=${timestamp}`}
            className="w-[300px] rounded-full border-2 border-background-dark transition-all group-hover:border-accent md:max-w-[220px]"
          />
        </a>
      </div>

      <div>
        <a href={artist.link} target="_blank">
          <div className="text-center font-bold">{artist.name}</div>
        </a>

        <div className="mt-1 flex flex-row justify-center space-x-1">
          {artist.genres.map((genre) => (
            <Tag
              key={genre}
              tag={genre}
              onClick={onGenreClick}
              active={activeGenres.includes(genre)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
