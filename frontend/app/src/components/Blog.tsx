import React from "react";

import Post from "./Post";
import PostRecord from "../models/PostRecord";
import SearchBar from "./SearchBar";
import "./Blog.css";
import {
  getSearchParams,
  makeQuery,
  GET,
} from "../controllers/RequestUtilities";

export interface BlogProps {}

export interface BlogState {
  posts: PostRecord[];
  searchText: string;
  currentPostId: string | null;
}

class Blog extends React.Component<BlogProps, BlogState> {
  state = {
    posts: [],
    searchText: "",
    currentPostId: null,
  };

  onClearSearch = () => {
    this.setState({ searchText: "" });
  };

  async componentDidMount() {
    const postsQuery = makeQuery("posts");
    const queryResult = await GET(postsQuery);
    this.setState({ posts: queryResult["posts"].reverse() });
    const params = getSearchParams();
    const queryPostId = params.get("postid");
    if (queryPostId) {
      this.setState({ currentPostId: queryPostId });
    }
  }

  getVideoTime = () => {
    const params = getSearchParams();
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
    const lowerSearchText = searchText.toLowerCase();

    if (
      post.deleted ||
      (this.state.currentPostId != null &&
        post.post_id !== this.state.currentPostId)
    ) {
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
      if (searchText.startsWith("#") && searchText.substring(1) === tag) {
        return true;
      }
    }

    for (const tag of post.tags) {
      if (tag.includes(searchText)) {
        return true;
      }
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
          <a className="Blog-title-link" href="/blog">
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
