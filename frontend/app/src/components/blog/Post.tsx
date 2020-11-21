import React from "react";

import Tag from "./Tag";
import PostRecord from "../../models/PostRecord";
import "./Post.sass";

import { formatDate } from "../../controllers/DateTimeUtilities";
import { makeURL, getSearchParams } from "../../controllers/RequestUtilities";

// import linkImage from "../images/link.svg";
// import detailsImage from "../images/details.svg";

export interface PostProps {
  post: PostRecord;
  videoTime: string;
  onClickTag: (tag: string) => void;
}

export interface PostState {
  contentLink: string;
  thumbnailUrl: string;
  showSummary: boolean;
}

const YOUTUBE_SOURCE = "YouTube";

class Post extends React.Component<PostProps, PostState> {
  state = {
    contentLink: "",
    thumbnailUrl: "",
    showSummary: false,
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
        <a className="Post-thumbnail-link" href={this.state.contentLink}>
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

  getTitleInfo = () => {
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

  getSummaryElement = () => {
    const summary = this.props.post.summary;
    if (summary && this.state.showSummary) {
      return <div className="Post-summary">{summary}</div>;
    }
  };

  toggleSummary = () => {
    this.setState({ showSummary: !this.state.showSummary });
  };

  render() {
    return (
      <div className="Post" id={this.props.post.post_id}>
        <div className="Post-text">
          <div className="Post-title-wrap">
            <a className="Post-title-link" href={this.state.contentLink}>
              {this.getTitleInfo()}
            </a>
          </div>
          {this.getSeriesInfo()}
          <div className="Post-date">
            {formatDate(this.props.post.date_posted)}
          </div>
        </div>
        {this.getThumbnailElement()}
        <div className="Post-tags">
          {this.props.post.tags.map((tag) => this.createTag(tag))}
        </div>

        {/* 
        <a
          className="Post-page-link"
          href={makeURL({ postid: this.props.post.post_id }, "blog")}
        >
          <img className="Post-page-link-image" src={linkImage} alt=""></img>
        </a>
        <div className="Post-page-link" onClick={this.toggleSummary}>
          <img className="Post-page-link-image" src={detailsImage} alt=""></img>
        </div>
        */}

        {this.getSummaryElement()}
      </div>
    );
  }
}

export default Post;