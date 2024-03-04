import { useEffect, useState } from "react";

import { Link as LinkIcon } from "@phosphor-icons/react";
import { Post as PostModel } from "../models/blogModels";
import { formatDate } from "../utilities/datetimeUtilities";
import { getSearchParams } from "../utilities/requestUtilities";
import { Tag } from "./Tag";

interface BlogPostProps {
  post: PostModel;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: PostModel) => void;
  activeTags: string[];
}

const YOUTUBE_SOURCE = "YouTube";

export function BlogPost({
  post,
  videoTime,
  onClickTag,
  onSelectPost,
  activeTags,
}: BlogPostProps) {
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
