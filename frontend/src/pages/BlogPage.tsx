import "../styles/common.css";

import { GET, getSearchParams, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BlogPost } from "../components/BlogPost";
import { BlogSearchBar } from "../components/BlogSearchBar";
import { Post as PostModel } from "../models/blogModels";

export function BlogPage() {
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
    <div className="bg-background pt-8">
      <div className="w-[80%] mx-auto text-center">
        <div className="font-noto text-text-1 text-3xl font-bold block mb-5">Link Blog</div>
        {slugOrIdExists ? (
          <div className="font-raleway text-text-1 block w-[80%] mx-auto pb-5">
            This page gives direct access to one blog link. To return to the full list of links click here:
          </div>
        ) : (
          <div className="font-raleway text-text-1 block w-[80%] mx-auto pb-5">
            Topics range from art to neuroscience and philosophy to physics. I try to reserve posts here for videos and
            articles that made me think differently, new paradigms rather than new facts. Stuff that meets that standard
            tends to be a bit longer, but personally I'd take that deal any day.
          </div>
        )}
      </div>
      <div className="pt-5">
        {slugOrIdExists ? (
          <div className="Common-button w-[120px] block text-center mx-auto" onClick={() => onSelectPost(null)}>
            Blog home
          </div>
        ) : (
          <div className="ml-10">
            <BlogSearchBar
              onClearSearch={() => setSearchText("")}
              onUpdateSearch={(event) => setSearchText(event.target.value)}
              searchText={searchText}
            />
          </div>
        )}
        <div className="py-10 pl-10">
          {posts.length === 0 ? (
            <span className="font-raleway text-text-2">Loading posts...</span>
          ) : (
            posts
              .filter(isPostVisible)
              .map((post) => (
                <BlogPost
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
