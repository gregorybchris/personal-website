import "../styles/common.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET, getSearchParams, makeQuery } from "../utilities/requestUtilities";

import { ArrowLeft } from "@phosphor-icons/react";
import { BlogPost } from "../components/BlogPost";
import { BlogSearchBar } from "../components/BlogSearchBar";
import { Post as PostModel } from "../models/blogModels";

export function BlogPage() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { slug } = useParams();
  let navigate = useNavigate();

  const activeTags = getActiveTags(searchText);

  function getActiveTags(searchText: string) {
    if (!searchText.startsWith("#")) {
      return [];
    }
    return [searchText.slice(1)];
  }

  useEffect(() => {
    const postsQuery = makeQuery("posts");
    GET(postsQuery).then((queryResult) => {
      setPosts(queryResult["posts"].reverse());
    });
  }, []);

  function getVideoTime() {
    const searchParams = getSearchParams();
    return searchParams.get("t") || "";
  }

  function onClickTag(tag: string) {
    if (searchText === `#${tag}`) {
      setSearchText("");
    } else {
      setSearchText(`#${tag}`);
    }
  }

  function isPostVisible(post: PostModel) {
    const lowerSearchText = searchText.toLowerCase();

    if (post.archived) {
      return false;
    }

    if (slug && post.slug !== slug) {
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
        lowerSearchText.startsWith("#") &&
        tag.startsWith(lowerSearchText.substring(1))
      ) {
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
      <div className="mx-auto w-[80%] text-center">
        <div className="mb-5 block font-noto text-3xl font-bold text-text-1">
          Link Blog
        </div>
        {!slug && (
          <div className="mx-auto block w-[80%] pb-5 font-raleway text-text-1">
            Topics range from art to neuroscience and philosophy to physics. I
            try to reserve posts here for videos and articles that made me think
            differently. Stuff that meets that standard tends to be a bit
            longer.
          </div>
        )}
      </div>
      <div className="pt-5">
        {slug && (
          <div
            className="mb-4 ml-10 inline-block cursor-pointer rounded-md px-2 py-1 hover:bg-background-dark"
            onClick={() => navigate("/links")}
          >
            <div className="flex flex-row space-x-2 font-raleway">
              <ArrowLeft size={25} color="#6283c0" weight="regular" />
              <div>Back to all links</div>
            </div>
          </div>
        )}
        {!slug && (
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
                  onClickTag={onClickTag}
                  onSelectPost={(post) => navigate(`/links/${post.slug}`)}
                  videoTime={getVideoTime()}
                  activeTags={activeTags}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
