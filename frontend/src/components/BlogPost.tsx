import { useEffect, useState } from "react";

import { BlogTag } from "./BlogTag";
import { Link as LinkIcon } from "@phosphor-icons/react";
import { Post as PostModel } from "../models/blogModels";
import { formatDate } from "../utilities/datetimeUtilities";
import { getSearchParams } from "../utilities/requestUtilities";

interface BlogPostProps {
  post: PostModel;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: PostModel) => void;
}

const YOUTUBE_SOURCE = "YouTube";

export function BlogPost(props: BlogPostProps) {
  const [contentLink, setContentLink] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  useEffect(() => {
    const postLink = props.post.link;
    const postLinkParams = getSearchParams(postLink);

    if (!thumbnailUrl) {
      if (props.post.source === YOUTUBE_SOURCE) {
        const idParam = postLinkParams.get("v");
        setThumbnailUrl(`https://img.youtube.com/vi/${idParam}/maxresdefault.jpg`);
      }
    }

    const videoTime = props.videoTime;
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
    const [hours, minutes, seconds] = length.split(":").map((v) => parseInt(v, 10));
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

  let title = props.post.title;
  if (props.post.speaker) {
    title = `${props.post.speaker}: ${title}`;
  }

  const seriesName = props.post.series;
  let seriesDetails = seriesName;
  if (props.post.episode_number) {
    seriesDetails = `${seriesDetails} (#${props.post.episode_number})`;
  }

  return (
    <div className="border-l-2 border-accent mb-10 max-w-[90%] py-3 pl-8" id={props.post.post_id}>
      <div className="pb-3">
        <div className="mb-2">
          <a href={contentLink} target="_blank" rel="noopener noreferrer">
            <div className="font-noto text-text-1 font-bold text-xl inline-block">{title}</div>
          </a>
          <div
            className="mb-1 cursor-pointer p-1 hover:bg-background-dark rounded-full mr-3 transition-all inline-block ml-2 align-middle"
            onClick={() => props.onSelectPost(props.post)}
          >
            <LinkIcon size={20} color="#6283C0" />
          </div>
        </div>
        {seriesName && (
          <div className="font-raleway text-text-2 font-bold mb-1 text-md inline-block">{seriesDetails}</div>
        )}
        <div className="font-raleway font-bold text-md text-text-2 mb-1">{formatDate(props.post.date_posted)}</div>
        {props.post.length && (
          <div className="font-raleway font-bold text-md text-text-2">{formatLength(props.post.length)}</div>
        )}
      </div>
      {thumbnailUrl && (
        <a href={contentLink} target="_blank" rel="noopener noreferrer">
          <img
            className="rounded-md w-[250px] shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
            src={thumbnailUrl}
            alt="Post thumbnail"
            onLoad={onThumbnailLoad}
          />
        </a>
      )}
      <div className="mt-3 mb-2">
        {props.post.tags.map((tag) => (
          <BlogTag key={tag} text={tag} onClickTag={props.onClickTag} />
        ))}
      </div>
    </div>
  );
}
