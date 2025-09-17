import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface BlogPost {
  title: string;
  slug: string;
  topics: string[];
  date: string;
  content: string;
  archived: boolean;
}

export interface BlogPostMetadata {
  title: string;
  slug: string;
  topics: string[];
  date: string;
  archived: boolean;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  let navigate = useNavigate();

  useEffect(() => {
    const postsQuery = makeQuery("blog/posts");
    GET(postsQuery).then((queryResult) => {
      setPosts(queryResult);
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-10 font-iowa md:px-10">
      <div className="font-sanchez text-3xl">Blog</div>

      <table className="max-w-[1000px] table-auto border-collapse">
        <tbody className="w-full">
          {posts.map((post) => (
            <tr
              key={post.slug}
              className="group cursor-pointer align-top"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <td className="text-balance py-1.5 pr-6 decoration-blue-500/60 underline-offset-4 group-hover:underline">
                {post.title}
              </td>
              <td className="whitespace-nowrap py-1.5 text-right text-black/50">
                {formatDate(new Date(post.date).toISOString())}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
