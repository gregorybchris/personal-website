import { ArrowLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/common.css";
import { GET, getSearchParams, makeQuery } from "../utilities/requestUtilities";

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
  let navigate = useNavigate();

  const activeTags = getActiveTags(searchText);

  function getActiveTags(searchText: string) {
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
    <div className="bg-background pt-8">
      <div className="mx-auto w-[80%] text-center">
        <div className="mb-5 block font-noto text-3xl font-bold text-text-1">
          Link Feed
        </div>
        {!slug && (
          <div className="mx-auto block w-[80%] pb-5 font-raleway text-text-1">
            Topics range from art to neuroscience and philosophy to physics. I
            try to reserve posts here for videos and articles that made me think
            differently. Stuff that meets that standard tends to be a bit
            longer.
          </div>
        )}
      </div>
      <div className="pt-5">
        {slug && (
          <div
            className="mb-4 ml-10 inline-block cursor-pointer rounded-md px-2 py-1 hover:bg-background-dark"
            onClick={() => navigate("/links")}
          >
            <div className="flex flex-row space-x-2 font-raleway">
              <ArrowLeft size={25} color="#6283c0" weight="regular" />
              <div>Back to all links</div>
            </div>
          </div>
        )}
        {!slug && (
          <div className="ml-10">
            <FeedSearchBar
              onClearSearch={() => setSearchText("")}
              onUpdateSearch={(event) => setSearchText(event.target.value)}
              searchText={searchText}
            />
          </div>
        )}
        <div className="py-10 pl-10">
          {posts.length === 0 ? (
            <span className="font-raleway text-text-2">Loading posts...</span>
          ) : (
            posts
              .filter(isPostVisible)
              .map((post) => (
                <FeedPostCard
                  key={post.post_id}
                  post={post}
                  onClickTag={onClickTag}
                  onSelectPost={(post) => navigate(`/links/${post.slug}`)}
                  videoTime={getVideoTime()}
                  activeTags={activeTags}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

import { Link as LinkIcon } from "@phosphor-icons/react";
import { Tag } from "../components/Tag";
import { FeedPost as PostModel } from "../models/feedModels";
import { formatDate } from "../utilities/datetimeUtilities";

interface FeedPostCardProps {
  post: PostModel;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: PostModel) => void;
  activeTags: string[];
}

const YOUTUBE_SOURCE = "YouTube";

function FeedPostCard({
  post,
  videoTime,
  onClickTag,
  onSelectPost,
  activeTags,
}: FeedPostCardProps) {
  const [contentLink, setContentLink] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  useEffect(() => {
    const postLink = post.link;
    const postLinkParams = getSearchParams(postLink);

    if (!thumbnailUrl) {
      if (post.source === YOUTUBE_SOURCE) {
        const idParam = postLinkParams.get("v");
        setThumbnailUrl(
          `https://img.youtube.com/vi/${idParam}/maxresdefault.jpg`,
        );
      }
    }

    const fullLink = videoTime ? `${postLink}&t=${videoTime}` : postLink;
    setContentLink(fullLink);
  }, []);

  function onThumbnailLoad(event: any) {
    const img = event.target;
    if (img.naturalHeight < 100) {
      const newSrc = img.src.replace("maxresdefault", "0");
      setThumbnailUrl(newSrc);
    }
  }

  function formatLength(length: string) {
    const [hours, minutes, seconds] = length
      .split(":")
      .map((v) => parseInt(v, 10));
    let formattedLength = "";
    if (hours === 0) {
      if (minutes === 0) {
        formattedLength = `${seconds}s`;
      } else {
        formattedLength = `${minutes}m`;
      }
    } else {
      if (minutes === 0) {
        formattedLength = `${hours}h`;
      } else {
        formattedLength = `${hours}h ${minutes}m`;
      }
    }
    return formattedLength;
  }

  let title = post.title;
  if (post.speaker) {
    title = `${post.speaker}: ${title}`;
  }

  const seriesName = post.series;
  let seriesDetails = seriesName;
  if (post.episode_number) {
    seriesDetails = `${seriesDetails} (#${post.episode_number})`;
  }

  return (
    <div
      className="mb-10 max-w-[90%] border-l-2 border-accent py-3 pl-8"
      id={post.post_id}
    >
      <div className="pb-3">
        <div className="mb-2">
          <a href={contentLink} target="_blank" rel="noopener noreferrer">
            <div className="inline-block font-noto text-xl font-bold text-text-1">
              {title}
            </div>
          </a>
          <div
            className="mb-1 ml-2 mr-3 inline-block cursor-pointer rounded-full p-1 align-middle transition-all hover:bg-background-dark"
            onClick={() => onSelectPost(post)}
          >
            <LinkIcon size={20} color="#6283c0" />
          </div>
        </div>
        {seriesName && (
          <div className="text-md mb-1 inline-block font-raleway font-bold text-text-2">
            {seriesDetails}
          </div>
        )}
        <div className="text-md mb-1 font-raleway font-bold text-text-2">
          {formatDate(post.date_posted)}
        </div>
        {post.length && (
          <div className="text-md font-raleway font-bold text-text-2">
            {formatLength(post.length)}
          </div>
        )}
      </div>
      {thumbnailUrl && (
        <a href={contentLink} target="_blank" rel="noopener noreferrer">
          <img
            className="w-[250px] rounded-md shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
            src={thumbnailUrl}
            alt="Post thumbnail"
            onLoad={onThumbnailLoad}
          />
        </a>
      )}
      <div className="mb-2 mt-3 flex flex-row flex-wrap space-x-1">
        {post.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            onClick={onClickTag}
            active={activeTags.includes(tag)}
          />
        ))}
      </div>
    </div>
  );
}

import "../styles/common.css";

interface FeedSearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onClearSearch: () => void;
}

function FeedSearchBar({
  searchText,
  onUpdateSearch,
  onClearSearch,
}: FeedSearchBarProps) {
  return (
    <div className="min-w-[340px]">
      <input
        className="Common-text-field inline-block w-[270px] align-top"
        type="text"
        value={searchText}
        onChange={onUpdateSearch}
        placeholder="Filter posts"
      />
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={onClearSearch}
      >
        Clear
      </div>
    </div>
  );
}
