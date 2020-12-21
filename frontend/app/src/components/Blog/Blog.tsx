import React from "react";
import { Link, match } from "react-router-dom";
import { History } from "history";

import Post from "./Post";
import PostModel from "./models/Post";
import SearchBar from "./SearchBar";
import "./styles/Blog.sass";
import { getSearchParams, makeQuery, GET } from "../../utilities/RequestUtilities";

interface BlogParams {
  slug: string;
}

interface BlogProps {
  match?: match<BlogParams>;
  history?: History;
}

interface BlogState {
  posts: PostModel[];
  searchText: string;
  currentPostId: string | null;
  currentPostSlug: string | null;
}

class Blog extends React.Component<BlogProps, BlogState> {
  state: BlogState = {
    posts: [],
    searchText: "",
    currentPostId: null,
    currentPostSlug: null,
  };

  onClearSearch = () => {
    this.setState({ searchText: "" });
  };

  onSelectPost = (post: PostModel | null) => {
    const history = this.props.history;
    if (history) {
      if (post === null) {
        history.push("/links");
      } else {
        history.push(`/links/${post.slug}`);
      }
    }
    if (post === null) {
      this.setState({ currentPostSlug: null });
    } else {
      this.setState({ currentPostSlug: post.slug });
    }
  };

  async componentDidMount() {
    const postsQuery = makeQuery("posts");
    const queryResult = await GET(postsQuery);
    this.setState({ posts: queryResult["posts"].reverse() });

    const searchParams = getSearchParams();
    const paramPostId = searchParams.get("post");
    if (paramPostId) {
      this.setState({ currentPostId: paramPostId });
    }

    const match = this.props.match;
    if (match) {
      const { slug } = match.params;
      if (slug) {
        this.setState({ currentPostSlug: slug });
      } else {
        this.setState({ currentPostSlug: null });
      }
    }
  }

  getVideoTime = () => {
    const searchParams = getSearchParams();
    const paramTime = searchParams.get("t");
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

    if (post.archived) {
      return false;
    }

    const slugOrIdExists = this.state.currentPostId != null || this.state.currentPostSlug != null;
    const currentIdMatch = post.post_id == this.state.currentPostId;
    const currentSlugMatch = post.slug == this.state.currentPostSlug;
    if (slugOrIdExists && !currentIdMatch && !currentSlugMatch) {
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
      if (searchText.startsWith("#") && tag.startsWith(searchText.substring(1))) {
        return true;
      }

      if (tag.startsWith(searchText)) {
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
          onSelectPost={this.onSelectPost}
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

  createAboutElement = () => {
    const slugOrIdExists = this.state.currentPostId !== null || this.state.currentPostSlug !== null;
    if (slugOrIdExists) {
      return (
        <div className="Blog-about">
          <div className="Blog-about-section">
            This page gives direct access to one blog link. To return to the full list of links click here:
          </div>
        </div>
      );
    }
    return (
      <div className="Blog-about">
        <div className="Blog-about-section">
          Topics range from art to neuroscience and philosophy to physics. I try to reserve posts here for stuff that
          made me think differently, new paradigms rather than new facts. Videos and articles that meet that criteria
          have a tendency to be pretty long, so judge for yourself if any are worth it.
        </div>
      </div>
    );
  };

  createContentsElement = () => {
    const slugOrIdExists = this.state.currentPostId !== null || this.state.currentPostSlug !== null;
    if (slugOrIdExists) {
      return (
        <div className="Blog-contents">
          <div className="Common-button Blog-home-button" onClick={() => this.onSelectPost(null)}>
            Blog home
          </div>
          <div className="Blog-posts">{this.createPostElements()}</div>
        </div>
      );
    } else {
      return (
        <div className="Blog-contents">
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
  };

  render() {
    return (
      <div className="Blog">
        <div className="Blog-header-wrap">
          <div className="Blog-title">Link Blog</div>
          {this.createAboutElement()}
        </div>
        {this.createContentsElement()}
      </div>
    );
  }
}

export default Blog;
