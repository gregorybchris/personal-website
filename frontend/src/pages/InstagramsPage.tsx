import { useEffect, useState } from "react";
import { POST, makeQuery } from "../utilities/requestUtilities";

import { Link as LinkIcon } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaSearchBar } from "../components/MediaSearchBar";
import { Tag } from "../components/Tag";
import { Instagram as InstagramModel } from "../models/mediaModels";
import { cn } from "../utilities/styleUtilities";

export function InstagramsPage() {
  const [instagrams, setInstagrams] = useState<InstagramModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  function queryInstagrams(query: string) {
    const instagramsQuery = makeQuery("media/instagrams");
    const currentId = id || null;
    const requestBody = { query, id: currentId };
    POST(instagramsQuery, requestBody)
      .then((response) => {
        console.log("Instagrams response:", response);
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
    queryInstagrams(query);
  }

  useEffect(() => {
    queryInstagrams(searchText);
  }, [id]);

  return (
    <div className="bg-background">
      <div className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl">
        Instagrams
      </div>

      <div className="flex flex-col space-y-7">
        <div className="flex flex-col items-center pt-10">
          <MediaSearchBar
            onSubmit={() => queryInstagrams(searchText)}
            setSearchText={setSearchText}
            searchText={searchText}
            updateQuery={updateQuery}
          />
        </div>

        {loading && (
          <div className="mt-10 text-center text-text-1">Loading...</div>
        )}
        {!loading && instagrams.length === 0 && (
          <div className="mt-10 text-center text-text-1">
            No Instagrams found
          </div>
        )}
        {!loading && instagrams.length > 0 && (
          <div className="flex flex-col items-center p-5">
            <div className="hidden grid-cols-4 gap-5 md:visible md:grid">
              {instagrams.map((instagram) => (
                <Instagram
                  key={instagram.id}
                  instagram={instagram}
                  className="w-full max-w-[90%] md:max-w-72"
                  updateQuery={updateQuery}
                />
              ))}
            </div>
            <div className="flex flex-col items-center space-y-8 md:hidden">
              {instagrams.map((instagram) => (
                <Instagram
                  key={instagram.id}
                  instagram={instagram}
                  className="w-full max-w-[90%] md:max-w-72"
                  updateQuery={updateQuery}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InstagramsProps {
  instagram: InstagramModel;
  className?: string;
  updateQuery: (query: string) => void;
}

export function Instagram({
  instagram,
  className,
  updateQuery,
}: InstagramsProps) {
  let navigate = useNavigate();

  const creator = instagram.creator;

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <video className="rounded-lg" src={instagram.url} controls />

      <div className="flex flex-row flex-wrap justify-center space-x-2">
        {instagram.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            active={false}
            onClick={() => updateQuery(tag)}
          />
        ))}
      </div>

      {creator && (
        <div className="font-raleway text-sm">
          Creator:{" "}
          <span
            className="cursor-pointer transition-all hover:text-accent-focus"
            onClick={() => updateQuery(creator)}
          >
            {creator}
          </span>
        </div>
      )}

      <div
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-background-highlight"
        onClick={() => navigate(`/hidden/instagrams/${instagram.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
