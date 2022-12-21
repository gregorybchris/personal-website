import "./styles/Blog.sass";

import { GET, getSearchParams, makeQuery } from "../../utilities/requestUtilities";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Post from "./Post";
import PostModel from "./models/Post";
import SearchBar from "./SearchBar";

export default function Blog() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [currentPostSlug, setCurrentPostSlug] = useState<string | null>(null);
  const { slug } = useParams();
  let navigate = useNavigate();

  function onClearSearch() {
    setSearchText("");
  }

  function onSelectPost(post: PostModel | null) {
    if (post === null) {
      setCurrentPostSlug(null);
      navigate("/links");
    } else {
      setCurrentPostSlug(post.slug);
      navigate(`/links/${post.slug}`);
    }
  }

  useEffect(() => {
    if (slug) {
      setCurrentPostSlug(slug);
    } else {
      setCurrentPostSlug(null);
    }
  }, [slug]);

  useEffect(() => {
    const postsQuery = makeQuery("posts");
    GET(postsQuery).then((queryResult) => {
      setPosts(queryResult["posts"].reverse());
    });

    const searchParams = getSearchParams();
    const paramPostId = searchParams.get("post");
    if (paramPostId) {
      setCurrentPostId(paramPostId);
    }

    if (slug) {
      setCurrentPostSlug(slug);
    } else {
      setCurrentPostSlug(null);
    }
  }, []);

  function getVideoTime() {
    const searchParams = getSearchParams();
    const paramTime = searchParams.get("t");
    return paramTime === null ? "" : paramTime;
  }

  function onUpdateSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  function onClickTag(tag: string) {
    setSearchText(`#${tag}`);
  }

  function isPostEnabled(post: PostModel) {
    const lowerSearchText = searchText.toLowerCase();

    if (post.archived) {
      return false;
    }

    const slugOrIdExists = currentPostId != null || currentPostSlug != null;
    const currentIdMatch = post.post_id === currentPostId;
    const currentSlugMatch = post.slug === currentPostSlug;
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
  }

  function createPostElement(post: PostModel) {
    if (isPostEnabled(post)) {
      const time = getVideoTime();
      return (
        <Post key={post.post_id} post={post} onClickTag={onClickTag} onSelectPost={onSelectPost} videoTime={time} />
      );
    }
  }

  function createPostElements() {
    if (posts.length === 0) {
      return <span className="Blog-posts-loading">Loading posts...</span>;
    } else {
      return posts.map((post) => createPostElement(post));
    }
  }

  function createAboutElement() {
    const slugOrIdExists = currentPostId !== null || currentPostSlug !== null;
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
  }

  function createContentsElement() {
    const slugOrIdExists = currentPostId !== null || currentPostSlug !== null;
    if (slugOrIdExists) {
      return (
        <div className="Blog-contents">
          <div className="Common-button Blog-home-button" onClick={() => onSelectPost(null)}>
            Blog home
          </div>
          <div className="Blog-posts">{createPostElements()}</div>
        </div>
      );
    } else {
      return (
        <div className="Blog-contents">
          <div className="Blog-search">
            <SearchBar onClearSearch={onClearSearch} onUpdateSearch={onUpdateSearch} searchText={searchText} />
          </div>
          <div className="Blog-posts">{createPostElements()}</div>
        </div>
      );
    }
  }

  return (
    <div className="Blog">
      <div className="Blog-header-wrap">
        <div className="Blog-title">Link Blog</div>
        {createAboutElement()}
      </div>
      {createContentsElement()}
    </div>
  );
}