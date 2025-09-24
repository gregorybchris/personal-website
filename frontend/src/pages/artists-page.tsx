import { useEffect, useState } from "react";
import { PageTitle } from "../components/page-title";
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
    <div className="flex flex-col items-center justify-items-center gap-5 px-2">
      <PageTitle>Artists</PageTitle>

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
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-3">
      <div className="flex justify-center">
        <a href={artist.link} target="_blank" className="group">
          <img
            src={`${artist.image_link}?cache=1`}
            className="group-hover:border-sky w-[300px] rounded-full border-2 border-neutral-300 transition-all md:max-w-[220px]"
          />
        </a>
      </div>

      <a href={artist.link} target="_blank">
        <div className="max-w-[150px] text-center text-balance">
          {artist.name}
        </div>
      </a>
    </div>
  );
}
