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
    <div className="flex flex-col items-start gap-4 px-4 font-iowa md:px-10">
      <div className="text-3xl font-bold">Blog</div>

      <table className="table-auto border-separate border-spacing-y-1">
        {posts.map((post) => (
          <tr
            key={post.slug}
            className="group cursor-pointer align-top"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <td className="whitespace-nowrap py-1.5 text-black/50">
              {formatDate(new Date(post.date).toISOString())}
            </td>
            <td className="text-balance py-1.5 pl-5 decoration-black/20 underline-offset-4 group-hover:underline">
              {post.title}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
