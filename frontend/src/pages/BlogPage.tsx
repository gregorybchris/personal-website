import "../styles/common.css";

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
    <div className="flex flex-col gap-4 px-10">
      <div className="">
        This is my blog where I write about stuff I'm working on.
      </div>
      <div className="flex flex-col">
        {posts
          .filter((p) => !p.archived)
          .map((post) => (
            <div
              key={post.slug}
              className="cursor-pointer text-sm hover:text-black/30"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              • {post.title}
            </div>
          ))}
      </div>
    </div>
  );
}
