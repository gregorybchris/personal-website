import React from "react";

import Post from "./Post";
import PostModel from "./models/Post";
import SearchBar from "./SearchBar";
import "./styles/Blog.sass";
import {
  getSearchParams,
  makeQuery,
  GET,
} from "../../utilities/RequestUtilities";

export interface BlogProps {}

export interface BlogState {
  posts: PostModel[];
  searchText: string;
  currentPostId: string | null;
}

class Blog extends React.Component<BlogProps, BlogState> {
  state: BlogState = {
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

  isPostEnabled = (post: PostModel) => {
    const searchText = this.state.searchText;
    const lowerSearchText = searchText.toLowerCase();

    if (
      post.archived ||
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
      if (
        searchText.startsWith("#") &&
        tag.startsWith(searchText.substring(1))
      ) {
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

  createPostElement = (post: PostModel) => {
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

  createPostElements = () => {
    const posts = this.state.posts;
    if (posts.length === 0) {
      return <span className="Blog-posts-loading">Loading posts...</span>;
    } else {
      return this.state.posts.map((post) => this.createPostElement(post));
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
        <div className="Blog-posts">{this.createPostElements()}</div>
      </div>
    );
  }
}

export default Blog;
