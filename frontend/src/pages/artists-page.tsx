import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/request-utilities";

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

  useEffect(() => {
    const artistsQuery = makeQuery("media/artists");
    GET(artistsQuery).then((artists: Artist[]) => {
      setArtists(artists);
    });
  }, []);

  return (
    <div className="grid justify-items-center pt-8">
      <div className="w-4/5">
        <div className="mb-5 text-center font-sanchez text-3xl text-black/75">
          Artists
        </div>
        <div className="mx-auto w-[95%] py-3 text-center text-black/75 md:w-[70%]">
          Some musical artists I like!
        </div>
      </div>

      <div className="grid w-4/5 grid-cols-1 justify-items-center pt-5 md:grid-cols-4 lg:grid-cols-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.name} artist={artist} />
        ))}
      </div>
    </div>
  );
}

interface ArtistCardProps {
  artist: Artist;
}
export function ArtistCard({ artist }: ArtistCardProps) {
  const timestamp = Date.now();
  return (
    <div className="flex flex-col items-center px-2 py-3">
      <div className="mb-2 flex justify-center">
        <a href={artist.link} target="_blank" className="group">
          <img
            src={`${artist.image_link}?a=${timestamp}`}
            className="w-[300px] rounded-full border-2 border-neutral-300 transition-all group-hover:border-accent md:max-w-[220px]"
          />
        </a>
      </div>

      <a href={artist.link} target="_blank">
        <div className="max-w-[150px] text-balance text-center">
          {artist.name}
        </div>
      </a>
    </div>
  );
}
