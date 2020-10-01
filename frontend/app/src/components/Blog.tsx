import Post from "./Post";
import PostRecord from "../models/PostRecord";
import React from "react";
import SearchBar from "./SearchBar";
import "./Blog.css";
import { getCurrentSearchParams } from "../controllers/RequestUtilities";

import posts from "../data/posts.json";

export interface BlogProps {}

export interface BlogState {
  posts: PostRecord[];
  searchText: string;
  currentPostId: string | null;
}

class Blog extends React.Component<BlogProps, BlogState> {
  state = {
    posts: posts,
    searchText: "",
    currentPostId: null,
  };

  onClearSearch = () => {
    this.setState({ searchText: "" });
  };

  componentDidMount() {
    this.setState({ posts: this.state.posts.reverse() });
    const params = getCurrentSearchParams();
    const queryPostId = params.get("postid");
    if (queryPostId) this.setState({ currentPostId: queryPostId });
  }

  getVideoTime = () => {
    const params = getCurrentSearchParams();
    const paramTime = params.get("t");
    return paramTime === null ? "" : paramTime;
  };

  onUpdateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value });
  };

  onClickTag = (tag: string) => {
    this.setState({ searchText: `#${tag}` });
  };

  isPostEnabled = (post: PostRecord) => {
    const searchText = this.state.searchText;

    if (post.deleted) return false;

    if (this.state.currentPostId)
      return post.post_id === this.state.currentPostId;

    if (searchText.length === 0) return true;

    if (post.title.toLowerCase().includes(searchText.toLowerCase()))
      return true;

    if (
      post.series &&
      post.series.toLowerCase().includes(searchText.toLowerCase())
    )
      return true;

    if (post.speaker?.toLowerCase().includes(searchText.toLowerCase()))
      return true;

    for (const tag of post.tags) {
      if (searchText.startsWith("#") && searchText.substring(1) === tag)
        return true;

      if (tag.includes(searchText)) return true;
    }
    return false;
  };

  createPost = (post: PostRecord) => {
    if (this.isPostEnabled(post)) {
      const time = this.getVideoTime();
      return (
        <Post
          key={post.post_id}
          post={post}
          onClickTag={this.onClickTag}
          videoTime={time}
        />
      );
    }
  };

  render() {
    return (
      <div className="Blog">
        <div className="Blog-header">
          <a className="Blog-title-link" href="/">
            <div className="Blog-title">Link Blog</div>
          </a>
        </div>
        <div className="Blog-search">
          <SearchBar
            onClearSearch={this.onClearSearch}
            onUpdateSearch={this.onUpdateSearch}
            searchText={this.state.searchText}
          />
        </div>
        <div className="Blog-posts">
          {this.state.posts.map((post) => this.createPost(post))}
        </div>
      </div>
    );
  }
}

export default Blog;
