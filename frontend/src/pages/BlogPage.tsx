import "../styles/common.css";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetimeUtilities";

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
    <div className="flex flex-col items-start gap-4 px-10 font-iowa">
      <div className="text-3xl font-bold">Blog</div>

      <table className="table-auto border-separate border-spacing-y-2">
        {posts.map((post) => (
          <tr
            key={post.slug}
            className="group cursor-pointer"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <td className="text-black/50">
              {formatDate(new Date(post.date).toISOString())}
            </td>
            <td className="px-3 decoration-black/20 underline-offset-4 group-hover:underline">
              {post.title}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
