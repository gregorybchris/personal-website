import { LinkIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { Tag } from "../components/tag";
import { POST, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface Instagram {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}

export function InstagramsPage() {
  const [instagrams, setInstagrams] = useState<Instagram[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  function runQuery(query: string) {
    const instagramsQuery = makeQuery("media/instagrams");
    const currentId = id || null;
    const requestBody = { query, id: currentId };
    POST(instagramsQuery, requestBody)
      .then((response) => {
        setInstagrams(response.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error querying Instagrams:", error);
        setLoading(false);
      });
  }

  function updateQuery(query: string) {
    setSearchText(query);
    runQuery(query);
  }

  useEffect(() => {
    runQuery(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      {!id && (
        <>
          <PageTitle>Instagrams</PageTitle>

          <SearchBar
            onSubmit={(text) => runQuery(text)}
            text={searchText}
            setText={setSearchText}
            className="w-[90%] max-w-[400px]"
          />
        </>
      )}

      {loading && <div className="text-center text-black/75">Loading...</div>}

      {!loading && instagrams.length === 0 && (
        <div className="text-center text-black/75">No Instagrams found</div>
      )}

      {!loading && instagrams.length > 0 && (
        <div className="flex flex-row flex-wrap items-start justify-center gap-x-4 gap-y-4">
          {instagrams.map((instagram) => (
            <InstagramCard
              key={instagram.id}
              instagram={instagram}
              updateQuery={updateQuery}
              className="w-full max-w-[90%] md:max-w-72"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface InstagramCardProps {
  instagram: Instagram;
  updateQuery: (query: string) => void;
  className?: string;
}

export function InstagramCard({
  instagram,
  updateQuery,
  className,
}: InstagramCardProps) {
  const navigate = useNavigate();

  const creator = instagram.creator;

  return (
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <video className="rounded-lg" src={instagram.url} controls />

      <div className="flex flex-row flex-wrap justify-center gap-x-2">
        {instagram.tags.map((tag) => (
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
        onClick={() => navigate(`/instagrams/${instagram.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
