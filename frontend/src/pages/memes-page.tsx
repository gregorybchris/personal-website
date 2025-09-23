import { Link as LinkIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { Tag } from "../components/tag";
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

  function runQuery(query: string) {
    const memesQuery = makeQuery("media/memes");
    const currentId = id || null;
    const requestBody = { query, id: currentId };
    POST(memesQuery, requestBody)
      .then((response) => {
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
    runQuery(query);
  }

  useEffect(() => {
    runQuery(searchText);
  }, [id]);

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <PageTitle>Memes</PageTitle>

      <SearchBar
        onSubmit={(text) => runQuery(text)}
        text={searchText}
        setText={setSearchText}
      />

      {loading && <div className="text-center text-black/75">Loading...</div>}

      {!loading && memes.length === 0 && (
        <div className="text-center text-black/75">No memes found</div>
      )}

      {!loading && memes.length > 0 && (
        <div className="flex flex-row flex-wrap items-start justify-center gap-x-4 gap-y-4">
          {memes.map((meme) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              updateQuery={updateQuery}
              className="w-full max-w-[90%] md:max-w-72"
            />
          ))}
        </div>
      )}
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
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      {isImage && <img className="rounded-lg" src={meme.url} />}
      {!isImage && <div>No preview available</div>}

      <div className="flex flex-row flex-wrap justify-center gap-x-2">
        {meme.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            selected={false}
            onClick={() => updateQuery(tag)}
          />
        ))}
      </div>

      <div
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-black/5"
        onClick={() => navigate(`/hidden/memes/${meme.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
