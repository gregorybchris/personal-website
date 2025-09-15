import "../styles/common.css";
import "../styles/fonts.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET, makeQuery } from "../utilities/requestUtilities";

import { BlogPost as BlogPostModel } from "../models/blogModels";
import { formatDate } from "../utilities/datetimeUtilities";

export function BlogPostPage() {
  const [currentPost, setCurrentPost] = useState<BlogPostModel | null>(null);
  const { slug } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const query = makeQuery(`blog/posts/${slug}`);
    GET(query).then((responseJson) => {
      setCurrentPost(responseJson);
    });
  }, []);

  return (
    <div className="flex flex-col items-center px-5 font-iowa md:px-10 md:py-10">
      {currentPost === null ? (
        <span className="">Loading post...</span>
      ) : (
        <div className="flex flex-col items-center gap-6 px-0 md:max-w-[700px]">
          <div className="flex flex-col items-center gap-2">
            <div className="text-balance text-center text-2xl font-bold md:max-w-[500px] md:text-3xl">
              {currentPost.title}
            </div>
            <div className="text-sm text-text-2">
              {formatDate(new Date(currentPost.date).toISOString())}
            </div>
          </div>

          <div className="md:text-md text-justify text-lg leading-relaxed">
            {currentPost.content}
          </div>

          <button
            className="rounded-md px-2 py-1 transition-all hover:bg-black/5"
            onClick={() => navigate("/blog")}
          >
            Back to posts
          </button>
        </div>
      )}
    </div>
  );
}
