import React from "react";

import Tag from "./Tag";
import PostModel from "./models/Post";
import "./styles/Post.sass";

import { formatDate } from "../../utilities/DateTimeUtilities";
import { getSearchParams } from "../../utilities/RequestUtilities";

import linkImage from "../../images/link.svg";

interface PostProps {
  post: PostModel;
  videoTime: string;
  onClickTag: (tag: string) => void;
  onSelectPost: (post: PostModel) => void;
}

interface PostState {
  contentLink: string;
  thumbnailUrl: string;
  aboutEnabled: boolean;
}

const YOUTUBE_SOURCE = "YouTube";

class Post extends React.Component<PostProps, PostState> {
  state: PostState = {
    contentLink: "",
    thumbnailUrl: "",
    aboutEnabled: false,
  };

  componentDidMount() {
    const postLink = this.props.post.link;
    const postLinkParams = getSearchParams(postLink);

    if (!this.state.thumbnailUrl) {
      if (this.props.post.source === YOUTUBE_SOURCE) {
        const idParam = postLinkParams.get("v");
        this.setState({
          thumbnailUrl: `https://img.youtube.com/vi/${idParam}/maxresdefault.jpg`,
        });
      }
    }

    const videoTime = this.props.videoTime;
    const fullLink = videoTime ? `${postLink}&t=${videoTime}` : postLink;
    this.setState({ contentLink: fullLink });
  }

  onThumbnailLoad = (event: any) => {
    const img = event.target;
    if (img.naturalHeight < 100) {
      const newSrc = img.src.replace("maxresdefault", "0");
      this.setState({ thumbnailUrl: newSrc });
    }
  };

  getThumbnailElement() {
    if (this.state.thumbnailUrl) {
      return (
        <a className="Post-thumbnail-link" href={this.state.contentLink} target="_blank" rel="noopener noreferrer">
          <img
            className="Post-thumbnail"
            src={this.state.thumbnailUrl}
            alt="Post thumbnail"
            onLoad={this.onThumbnailLoad}
          ></img>
        </a>
      );
    }
  }

  createTag = (tag: string) => {
    return <Tag key={tag} text={tag} onClickTag={this.props.onClickTag} />;
  };

  getSeriesInfo = () => {
    let elements = [];
    if (this.props.post.series !== null) {
      elements.push(
        <div className="Post-series-info" key="series">
          {this.props.post.series}
        </div>
      );
    }
    if (this.props.post.episode_number) {
      elements.push(
        <div className="Post-series-info" key="episode">
          &nbsp;{`(#${this.props.post.episode_number})`}
        </div>
      );
    }
    return elements;
  };

  getVideoLength = () => {
    if (this.props.post.length == null) {
      return <></>;
    }
    const length = this.props.post.length;
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
    return <div className="Post-video-length">{formattedLength}</div>;
  };

  getTitleElement = () => {
    let elements = [];
    if (this.props.post.speaker !== null) {
      elements.push(
        <div className="Post-title" key="speaker">
          {`${this.props.post.speaker}: `}&nbsp;
        </div>
      );
    }
    elements.push(
      <div className="Post-title" key="title">
        {this.props.post.title}
      </div>
    );
    return elements;
  };

  toggleAboutSection = () => {
    this.setState({ aboutEnabled: !this.state.aboutEnabled });
  };

  getAboutSection = () => {
    const hook = this.props.post.hook;
    if (hook === null) {
      return <></>;
    }

    let arrow = this.state.aboutEnabled ? <>&#8679;</> : <>&#8681;</>;
    let aboutTextElement = <></>;
    if (this.state.aboutEnabled) {
      aboutTextElement = <div className="Post-about-text">{hook}</div>;
    }
    return (
      <div className="Post-about-section" onClick={this.toggleAboutSection}>
        <div className="Common-simple-link">About {arrow}</div>
        {aboutTextElement}
      </div>
    );
  };

  render() {
    return (
      <div className="Post" id={this.props.post.post_id}>
        <div className="Post-info">
          <div className="Post-title-wrap">
            <a className="Post-title-link" href={this.state.contentLink} target="_blank" rel="noopener noreferrer">
              {this.getTitleElement()}
            </a>
            <img
              className="Post-link-image"
              src={linkImage}
              onClick={() => this.props.onSelectPost(this.props.post)}
              alt="Post link"
            ></img>
          </div>
          {this.getSeriesInfo()}
          <div className="Post-date">{formatDate(this.props.post.date_posted)}</div>
          {this.getVideoLength()}
          {this.getAboutSection()}
        </div>
        {this.getThumbnailElement()}
        <div className="Post-tags">{this.props.post.tags.map((tag) => this.createTag(tag))}</div>
      </div>
    );
  }
}

export default Post;
