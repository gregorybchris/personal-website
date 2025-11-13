import { LinkIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { Tag } from "../components/tag";
import { POST, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface Tiktok {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}

export function TiktoksPage() {
  const [tiktoks, setTiktoks] = useState<Tiktok[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const runQuery = useCallback(
    (query: string) => {
      const tiktoksQuery = makeQuery("media/tiktoks");
      const currentId = id || null;
      const requestBody = { query, id: currentId };
      POST<{ results: Tiktok[] }>(tiktoksQuery, requestBody)
        .then((response) => {
          setTiktoks(response.results);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error querying TikToks:", error);
          setLoading(false);
        });
    },
    [id],
  );

  const updateQuery = useCallback((query: string) => {
    setSearchText(query);
    // SearchBar will auto-submit via onSubmit when text changes
  }, []);

  useEffect(() => {
    runQuery(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      {!id && (
        <>
          <PageTitle>TikToks</PageTitle>

          <SearchBar
            onSubmit={runQuery}
            text={searchText}
            setText={setSearchText}
            className="w-[90%] max-w-[400px]"
          />
        </>
      )}

      {loading && <div className="text-center text-black/75">Loading...</div>}

      {!loading && tiktoks.length === 0 && (
        <div className="text-center text-black/75">No TikToks found</div>
      )}

      {!loading && tiktoks.length > 0 && (
        <div className="flex flex-row flex-wrap items-start justify-center gap-x-4 gap-y-4">
          {tiktoks.map((tiktok) => (
            <TiktokCard
              key={tiktok.id}
              tiktok={tiktok}
              updateQuery={updateQuery}
              className="w-full max-w-[90%] md:max-w-72"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TikTokCardProps {
  tiktok: Tiktok;
  updateQuery: (query: string) => void;
  className?: string;
}

export function TiktokCard({
  tiktok,
  updateQuery,
  className,
}: TikTokCardProps) {
  const navigate = useNavigate();

  const creator = tiktok.creator;

  return (
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <video
        className="rounded-lg"
        src={tiktok.url}
        controls
        onClick={() => {
          // Blur any focused element (like search bar) to prevent scroll-back on mobile
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
      />

      <div className="flex flex-row flex-wrap justify-center gap-x-2">
        {tiktok.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            selected={false}
            onClick={() => updateQuery(tag)}
          />
        ))}
      </div>

      {creator && (
        <div className="text-sm">
          Creator:{" "}
          <span
            className="hover:text-royal cursor-pointer transition-all"
            onClick={() => updateQuery(creator)}
          >
            {creator}
          </span>
        </div>
      )}

      <div
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-black/5"
        onClick={() => navigate(`/tiktoks/${tiktok.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
