import { useEffect, useState } from "react";
import { POST, makeQuery } from "../utilities/requestUtilities";

import { Tag } from "../components/Tag";
import { TiktoksSearchBar } from "../components/TiktoksSearchBar";
import { Tiktok as TiktokModel } from "../models/mediaModels";

export function TiktoksPage() {
  const [tiktoks, setTiktoks] = useState<TiktokModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  function queryTiktoks() {
    const tiktoksQuery = makeQuery("media/tiktoks");
    const requestBody = { query: searchText };
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

  useEffect(() => {
    queryTiktoks();
  }, []);

  return (
    <div className="bg-background">
      <div className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl">
        TikToks
      </div>

      <div className="flex flex-col space-y-7">
        <div className="flex flex-col items-center pt-10">
          <TiktoksSearchBar
            onSubmit={() => queryTiktoks()}
            onUpdateSearch={(event) => setSearchText(event.target.value)}
            searchText={searchText}
          />
        </div>

        {loading && (
          <div className="mt-10 text-center text-text-1">Loading...</div>
        )}
        {!loading && tiktoks.length === 0 && (
          <div className="mt-10 text-center text-text-1">No TikToks found</div>
        )}
        {!loading && tiktoks.length > 0 && (
          <div className="flex flex-col items-center space-y-8">
            {tiktoks.map((tiktok, index) => (
              <div className="flex flex-col items-center space-y-2" key={index}>
                <video
                  className="w-full max-w-[90%] rounded-lg md:max-w-72"
                  src={tiktok.url}
                  controls
                />

                <div className="flex max-w-72 flex-row flex-wrap justify-center space-x-2">
                  {tiktok.tags.map((tag) => (
                    <Tag
                      key={tag}
                      tag={tag}
                      active={false}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
