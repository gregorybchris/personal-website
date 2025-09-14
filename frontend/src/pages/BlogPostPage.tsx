import "../styles/common.css";

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
            <div>{currentPost.title}</div>
            <div>{new Date(currentPost.date).toLocaleDateString()}</div>
            <div>{currentPost.content}</div>
          </div>
        )}
      </div>
      <button className="" onClick={() => navigate("/blog")}>
        Back to blog
      </button>
    </div>
  );
}
