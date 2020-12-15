import React from "react";
import { Link, match } from "react-router-dom";

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
      return <Post key={post.post_id} post={post} onClickTag={this.onClickTag} videoTime={time} />;
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
        <div className="Blog-header-wrap">
          <div className="Blog-title">Link Blog</div>
          <div className="Blog-about">
            On this page you'll find a whole lot of links to stuff online. Topics range from art to neuroscience and
            philosophy to physics. This is where I dump the videos and articles that I found mindblowing, but take more
            time to consume than most people would care to spend. I try to reserve posts here for stuff that made me
            think differently, new paradigms rather than new facts.
          </div>
          <div className="Blog-about">
            <span className="Blog-about-note">Disclaimer:</span> I'm not under the impression that all claims made in
            the linked content are factual, but I do believe much of what you'll find here can be valuable with the
            appopriate amount of critical thought. If you find anything here to be either offensive or potentially
            harmful please reach out to me through my{" "}
            <Link className="Common-simple-link" to="/contact">
              Contact
            </Link>{" "}
            page.
          </div>
        </div>
        <div className="Blog-contents">
          {this.state.currentPostId || this.state.currentPostSlug ? (
            <></>
          ) : (
            <div className="Blog-search">
              <SearchBar
                onClearSearch={this.onClearSearch}
                onUpdateSearch={this.onUpdateSearch}
                searchText={this.state.searchText}
              />
            </div>
          )}
          <div className="Blog-posts">{this.createPostElements()}</div>
        </div>
      </div>
    );
  }
}

export default Blog;
