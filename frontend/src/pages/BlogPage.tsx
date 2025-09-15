import "../styles/common.css";
import "../styles/fonts.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET, makeQuery } from "../utilities/requestUtilities";

import { BlogPost as BlogPostModel } from "../models/blogModels";

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostModel[]>([]);
  let navigate = useNavigate();

  useEffect(() => {
    const postsQuery = makeQuery("blog/posts");
    GET(postsQuery).then((queryResult) => {
      setPosts(queryResult);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 px-10 font-iowa">
      <div className="text-3xl font-bold">Blog</div>
      <div className="text-lg">
        This is my blog where I write about stuff I'm working on.
      </div>
      <div className="flex flex-col">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="cursor-pointer text-base hover:text-black/30"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            • {post.title}
          </div>
        ))}
      </div>
    </div>
  );
}
