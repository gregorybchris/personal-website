import { LinkIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { Tag } from "../components/tag";
import { POST, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface YouTubeVideo {
  id: string;
  url: string;
  tags: string[];
  creator?: string;
  favorite: boolean;
}

export function YouTubeVideosPage() {
  const [youtubeVideos, setYouTubeVideos] = useState<YouTubeVideo[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const runQuery = useCallback(
    (query: string) => {
      const youtubeVideosQuery = makeQuery("media/youtube_videos");
      const currentId = id || null;
      const requestBody = { query, id: currentId };
      POST<{ results: YouTubeVideo[] }>(youtubeVideosQuery, requestBody)
        .then((response) => {
          setYouTubeVideos(response.results);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error querying YouTube videos:", error);
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
          <PageTitle>YouTube Videos</PageTitle>

          <SearchBar
            onSubmit={runQuery}
            text={searchText}
            setText={setSearchText}
            className="w-[90%] max-w-[400px]"
          />
        </>
      )}

      {loading && <div className="text-center text-black/75">Loading...</div>}

      {!loading && youtubeVideos.length === 0 && (
        <div className="text-center text-black/75">No YouTube videos found</div>
      )}

      {!loading && youtubeVideos.length > 0 && (
        <div className="flex flex-row flex-wrap items-start justify-center gap-x-4 gap-y-4">
          {youtubeVideos.map((youtubeVideo) => (
            <YouTubeVideoCard
              key={youtubeVideo.id}
              youtubeVideo={youtubeVideo}
              updateQuery={updateQuery}
              className="w-full max-w-[90%] md:max-w-72"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface YouTubeVideoCardProps {
  youtubeVideo: YouTubeVideo;
  updateQuery: (query: string) => void;
  className?: string;
}

export function YouTubeVideoCard({
  youtubeVideo,
  updateQuery,
  className,
}: YouTubeVideoCardProps) {
  const navigate = useNavigate();

  const creator = youtubeVideo.creator;

  return (
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <video
        className="rounded-lg"
        src={youtubeVideo.url}
        controls
        onPlay={() => {
          // Blur any focused element (like search bar) to prevent scroll-back on mobile
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
      />

      <div className="flex flex-row flex-wrap justify-center gap-x-2">
        {youtubeVideo.tags.map((tag) => (
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
        onClick={() => navigate(`/youtube-videos/${youtubeVideo.id}`)}
      >
        <LinkIcon size={20} color="#6283c0" />
      </div>
    </div>
  );
}
