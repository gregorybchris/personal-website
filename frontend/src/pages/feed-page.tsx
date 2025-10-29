import { ArrowLeftIcon, LinkIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../components/icon-button";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { Tag } from "../components/tag";
import { formatDate } from "../utilities/datetime-utilities";
import {
  GET,
  getSearchParams,
  makeQuery,
} from "../utilities/request-utilities";

export interface FeedPost {
  post_id: string;
  title: string;
  slug: string;
  content_type: string;
  source: string | null;
  areas: string[];
  series: string | null;
  speaker: string | null;
  episode_number: number | null;
  length: string | null;
  date_created: string | null;
  date_posted: string;
  link: string;
  tags: string[];
  hook: string | null;
  summary: string | null;
  paid: boolean;
  archived: boolean;
}

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { slug } = useParams();
  const navigate = useNavigate();

  const selectedTags = getSelectedTags(searchText);

  function getSelectedTags(searchText: string): string[] {
    if (!searchText.startsWith("#")) {
      return [];
    }
    return [searchText.slice(1)];
  }

  useEffect(() => {
    const postsQuery = makeQuery("feed/posts");
    GET(postsQuery).then((queryResult) => {
      setPosts(queryResult["posts"].reverse());
    });
  }, []);

  function getVideoTime() {
    const searchParams = getSearchParams();
    return searchParams.get("t") || "";
  }

  function onClickTag(tag: string) {
    if (searchText === `#${tag}`) {
      setSearchText("");
    } else {
      setSearchText(`#${tag}`);
    }
  }

  function isPostVisible(post: FeedPost) {
    const lowerSearchText = searchText.toLowerCase();

    if (post.archived) {
      return false;
    }

    if (slug && post.slug !== slug) {
      return false;
    }

    if (
      searchText.length === 0 ||
      post.title.toLowerCase().includes(lowerSearchText) ||
      post.series?.toLowerCase()?.includes(lowerSearchText) ||
      post.speaker?.toLowerCase()?.includes(lowerSearchText)
    ) {
      return true;
    }

    for (const tag of post.tags) {
      if (
        lowerSearchText.startsWith("#") &&
        tag.startsWith(lowerSearchText.substring(1))
      ) {
        return true;
      }

      if (tag.startsWith(lowerSearchText)) {
        return true;
      }
    }

    return false;
  }

  return (
    <div className="flex flex-col items-center gap-10 px-5 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Link Feed</PageTitle>

        <div className="text-center text-black/75 md:w-[70%]">
          Topics range from art to neuroscience and philosophy to physics. I try
          to reserve posts here for videos and articles that made me think
          differently. Stuff that meets that standard tends to be a bit longer.
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        {slug && (
          <div
            className="flex cursor-pointer flex-row gap-x-2 rounded-md px-2 py-1 hover:bg-black/8"
            onClick={() => navigate("/feed")}
          >
            <ArrowLeftIcon size={25} color="#6283c0" />
            <div>Back to all links</div>
          </div>
        )}

        {!slug && (
          <SearchBar
            placeholder="Filter posts"
            text={searchText}
            setText={setSearchText}
            className="w-[90%] max-w-[400px]"
          />
        )}

        <div className="flex flex-col gap-4">
          {posts.length === 0 && (
            <span className="text-black/60">Loading posts...</span>
          )}
          {posts.length > 0 && posts.filter(isPostVisible).length === 0 && (
            <span className="text-black/60">No posts matched filter</span>
          )}
          {posts.length > 0 &&
            posts.filter(isPostVisible).length > 0 &&
            posts
              .filter(isPostVisible)
              .map((post) => (
                <FeedPostCard
                  key={post.post_id}
                  post={post}
                  onClickTag={onClickTag}
                  onSelectPost={(post) => navigate(`/feed/${post.slug}`)}
                  videoTime={getVideoTime()}
                  selectedTags={selectedTags}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

interface FeedPostCardProps {
  post: FeedPost;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: FeedPost) => void;
  selectedTags: string[];
}

function FeedPostCard({
  post,
  videoTime,
  onClickTag,
  onSelectPost,
  selectedTags,
}: FeedPostCardProps) {
  const [contentLink, setContentLink] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  useEffect(() => {
    const postLink = post.link;
    const postLinkParams = getSearchParams(postLink);

    if (!thumbnailUrl) {
      if (post.source === "YouTube") {
        const idParam = postLinkParams.get("v");
        setThumbnailUrl(
          `https://img.youtube.com/vi/${idParam}/maxresdefault.jpg`,
        );
      }
    }

    const fullLink = videoTime ? `${postLink}&t=${videoTime}` : postLink;
    setContentLink(fullLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onThumbnailLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.target as HTMLImageElement;
    if (img.naturalHeight < 100) {
      const newSrc = img.src.replace("maxresdefault", "0");
      setThumbnailUrl(newSrc);
    }
  }

  function formatLength(length: string) {
    const [hours, minutes, seconds] = length
      .split(":")
      .map((v) => parseInt(v, 10));

    if (hours === 0) {
      return minutes === 0 ? `${seconds}s` : `${minutes}m`;
    }
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  }

  const title = post.speaker ? `${post.speaker}: ${post.title}` : post.title;

  const seriesName = post.series;
  const seriesDetails = post.episode_number
    ? `${seriesName} (#${post.episode_number})`
    : seriesName;

  return (
    <div
      className="border-sky flex max-w-[600px] flex-col items-start gap-3 border-l-2 px-6 py-1"
      id={post.post_id}
    >
      <div className="flex flex-col gap-1 px-2">
        <a href={contentLink} target="_blank" rel="noopener noreferrer">
          <div className="font-sanchez text-xl text-balance text-black/75">
            {title}
          </div>
        </a>

        <div className="flex flex-col gap-0.5 text-sm">
          {seriesName && <div className="text-black/60">{seriesDetails}</div>}

          <div className="text-black/60">{formatDate(post.date_posted)}</div>

          {post.length && (
            <div className="text-black/60">{formatLength(post.length)}</div>
          )}
        </div>
      </div>

      {thumbnailUrl && (
        <div className="px-2">
          <a href={contentLink} target="_blank" rel="noopener noreferrer">
            <img
              className="w-[250px] rounded-md shadow-lg"
              src={thumbnailUrl}
              alt="Post thumbnail"
              onLoad={onThumbnailLoad}
            />
          </a>
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-0.5">
        {post.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            onClick={onClickTag}
            selected={selectedTags.includes(tag)}
            className="text-xs"
          />
        ))}
      </div>

      <IconButton onClick={() => onSelectPost(post)}>
        <LinkIcon size={16} color="#6283c0" />{" "}
        <div className="text-sm">Link</div>
      </IconButton>
    </div>
  );
}
