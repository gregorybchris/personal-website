import "./styles/Post.sass";

import { useEffect, useState } from "react";

import PostModel from "./models/Post";
import Tag from "./Tag";
import { formatDate } from "../../utilities/datetimeUtilities";
import { getSearchParams } from "../../utilities/requestUtilities";
import linkImage from "../../images/link.svg";

interface PostProps {
  post: PostModel;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: PostModel) => void;
}

const YOUTUBE_SOURCE = "YouTube";

export default function Post(props: PostProps) {
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
    <div className="Post" id={props.post.post_id}>
      <div className="Post-info">
        <div className="Post-title-wrap">
          <a className="Post-title-link" href={contentLink} target="_blank" rel="noopener noreferrer">
            <div className="Post-title">{title}</div>
          </a>
          <img
            className="Post-link-image"
            src={linkImage}
            onClick={() => props.onSelectPost(props.post)}
            alt="Post link"
          ></img>
        </div>
        {seriesName && <div className="Post-series-info">{seriesDetails}</div>}
        <div className="Post-date">{formatDate(props.post.date_posted)}</div>
        {props.post.length && <div className="Post-video-length">{formatLength(props.post.length)}</div>}
      </div>
      {thumbnailUrl && (
        <a className="Post-thumbnail-link" href={contentLink} target="_blank" rel="noopener noreferrer">
          <img className="Post-thumbnail" src={thumbnailUrl} alt="Post thumbnail" onLoad={onThumbnailLoad} />
        </a>
      )}
      <div className="Post-tags">
        {props.post.tags.map((tag) => (
          <Tag key={tag} text={tag} onClickTag={props.onClickTag} />
        ))}
      </div>
    </div>
  );
}
