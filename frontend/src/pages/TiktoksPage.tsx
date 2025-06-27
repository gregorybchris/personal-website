import { useEffect, useState } from "react";
import { POST, makeQuery } from "../utilities/requestUtilities";

import { Link as LinkIcon } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaSearchBar } from "../components/MediaSearchBar";
import { Tag } from "../components/Tag";
import { Tiktok as TiktokModel } from "../models/mediaModels";
import { cn } from "../utilities/styleUtilities";

export function TiktoksPage() {
  const [tiktoks, setTiktoks] = useState<TiktokModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  function queryTiktoks(query: string) {
    const tiktoksQuery = makeQuery("media/tiktoks");
    const currentId = id || null;
    const requestBody = { query, id: currentId };
    POST(tiktoksQuery, requestBody)
      .then((response) => {
        console.log("Tiktoks response:", response);
        setTiktoks(response.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error querying TikToks:", error);
        setLoading(false);
      });
  }

  function updateQuery(query: string) {
    setSearchText(query);
    queryTiktoks(query);
  }

  useEffect(() => {
    queryTiktoks(searchText);
  }, [id]);

  return (
    <div className="bg-background">
      <div className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl">
        TikToks
      </div>

      <div className="flex flex-col space-y-7">
        <div className="flex flex-col items-center pt-10">
          <MediaSearchBar
            onSubmit={() => queryTiktoks(searchText)}
            setSearchText={setSearchText}
            searchText={searchText}
            updateQuery={updateQuery}
          />
        </div>

        {loading && (
          <div className="mt-10 text-center text-text-1">Loading...</div>
        )}
        {!loading && tiktoks.length === 0 && (
          <div className="mt-10 text-center text-text-1">No TikToks found</div>
        )}
        {!loading && tiktoks.length > 0 && (
          <div className="flex flex-col items-center p-5">
            <div className="hidden grid-cols-4 gap-5 md:visible md:grid">
              {tiktoks.map((tiktok) => (
                <Tiktok
                  key={tiktok.id}
                  tiktok={tiktok}
                  updateQuery={updateQuery}
                  className="w-full max-w-[90%] md:max-w-72"
                />
              ))}
            </div>
            <div className="flex flex-col items-center space-y-8 md:hidden">
              {tiktoks.map((tiktok) => (
                <Tiktok
                  key={tiktok.id}
                  tiktok={tiktok}
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

interface TikTokProps {
  tiktok: TiktokModel;
  updateQuery: (query: string) => void;
  className?: string;
}

export function Tiktok({ tiktok, updateQuery, className }: TikTokProps) {
  let navigate = useNavigate();

  const creator = tiktok.creator;

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <video className="rounded-lg" src={tiktok.url} controls />

      <div className="flex flex-row flex-wrap justify-center space-x-2">
        {tiktok.tags.map((tag) => (
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
        onClick={() => navigate(`/hidden/tiktoks/${tiktok.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
