import "../styles/common.css";
import "../styles/fonts.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET, makeQuery } from "../utilities/requestUtilities";

import { BlogPost as BlogPostModel } from "../models/blogModels";

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
    <div className="flex flex-col gap-4 px-10">
      <div className="">
        {currentPost === null ? (
          <span className="">Loading post...</span>
        ) : (
          <div>
            <div className="mb-4 font-iowa text-3xl font-bold">
              {currentPost.title}
            </div>
            <div className="mb-6 font-iowa text-sm text-text-2">
              {new Date(currentPost.date).toLocaleDateString()}
            </div>
            <div className="font-iowa text-lg leading-relaxed">
              {currentPost.content}
            </div>
          </div>
        )}
      </div>
      <button
        className="self-start font-iowa text-base hover:text-black/30"
        onClick={() => navigate("/blog")}
      >
        Back to blog
      </button>
    </div>
  );
}
