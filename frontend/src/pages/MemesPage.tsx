import { Link as LinkIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaSearchBar } from "../components/MediaSearchBar";
import { Tag } from "../components/Tag";
import { POST, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface Meme {
  id: string;
  url: string;
  tags: string[];
  favorite: boolean;
  format: string;
  era: string;
}

export function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  function queryMemes(query: string) {
    const memesQuery = makeQuery("media/memes");
    const currentId = id || null;
    const requestBody = { query, id: currentId };
    POST(memesQuery, requestBody)
      .then((response) => {
        console.log("Memes response:", response);
        setMemes(response.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error querying memes:", error);
        setLoading(false);
      });
  }

  function updateQuery(query: string) {
    setSearchText(query);
    queryMemes(query);
  }

  useEffect(() => {
    queryMemes(searchText);
  }, [id]);

  return (
    <div className="bg-background">
      <div className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl">
        Memes
      </div>

      <div className="flex flex-col space-y-7">
        <div className="flex flex-col items-center pt-10">
          <MediaSearchBar
            onSubmit={() => queryMemes(searchText)}
            setSearchText={setSearchText}
            searchText={searchText}
            updateQuery={updateQuery}
          />
        </div>

        {loading && (
          <div className="mt-10 text-center text-text-1">Loading...</div>
        )}
        {!loading && memes.length === 0 && (
          <div className="mt-10 text-center text-text-1">No memes found</div>
        )}
        {!loading && memes.length > 0 && (
          <div className="flex flex-col items-center p-5">
            <div className="hidden grid-cols-4 gap-5 md:visible md:grid">
              {memes.map((meme) => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  updateQuery={updateQuery}
                  className="w-full max-w-[90%] md:max-w-72"
                />
              ))}
            </div>
            <div className="flex flex-col items-center space-y-8 md:hidden">
              {memes.map((meme) => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  updateQuery={updateQuery}
                  className="w-full max-w-[90%] md:max-w-72"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MemeCardProps {
  meme: Meme;
  updateQuery: (query: string) => void;
  className?: string;
}

export function MemeCard({ meme, updateQuery, className }: MemeCardProps) {
  let navigate = useNavigate();

  const isImage = ["gif", "png", "jpg"].includes(meme.format);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {isImage && <img className="rounded-lg" src={meme.url} />}
      {!isImage && <div>No preview available</div>}

      <div className="flex flex-row flex-wrap justify-center space-x-2">
        {meme.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            active={false}
            onClick={() => updateQuery(tag)}
          />
        ))}
      </div>

      <div
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-background-highlight"
        onClick={() => navigate(`/hidden/memes/${meme.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
