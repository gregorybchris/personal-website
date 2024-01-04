import "./styles/Blog.sass";

import { GET, getSearchParams, makeQuery } from "../../utilities/requestUtilities";
import { useEffect, useState } from "react";
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

  const slugOrIdExists = currentPostId !== null || currentPostSlug !== null;

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

  function isPostVisible(post: PostModel) {
    const lowerSearchText = searchText.toLowerCase();

    if (post.archived) {
      return false;
    }

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
      if (lowerSearchText.startsWith("#") && tag.startsWith(lowerSearchText.substring(1))) {
        return true;
      }

      if (tag.startsWith(lowerSearchText)) {
        return true;
      }
    }

    return false;
  }

  return (
    <div className="Blog">
      <div className="Blog-header-wrap">
        <div className="Blog-title">Link Blog</div>
        {slugOrIdExists ? (
          <div className="Blog-about">
            <div className="Blog-about-section">
              This page gives direct access to one blog link. To return to the full list of links click here:
            </div>
          </div>
        ) : (
          <div className="Blog-about">
            <div className="Blog-about-section">
              Topics range from art to neuroscience and philosophy to physics. I try to reserve posts here for videos
              and articles that made me think differently, new paradigms rather than new facts. Stuff that meets that
              standard tends to be a bit longer, but personally I'd take that deal any day.
            </div>
          </div>
        )}
      </div>
      <div className="Blog-contents">
        {slugOrIdExists ? (
          <div className="Common-button Blog-home-button" onClick={() => onSelectPost(null)}>
            Blog home
          </div>
        ) : (
          <div className="Blog-search">
            <SearchBar
              onClearSearch={() => setSearchText("")}
              onUpdateSearch={(event) => setSearchText(event.target.value)}
              searchText={searchText}
            />
          </div>
        )}
        <div className="Blog-posts">
          {posts.length === 0 ? (
            <span className="Blog-posts-loading">Loading posts...</span>
          ) : (
            posts
              .filter(isPostVisible)
              .map((post) => (
                <Post
                  key={post.post_id}
                  post={post}
                  onClickTag={(tag) => setSearchText(`#${tag}`)}
                  onSelectPost={onSelectPost}
                  videoTime={getVideoTime()}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
