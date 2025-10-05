import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface BlogPostPreview {
  title: string;
  slug: string;
  date: string;
  reading_time: number | null;
}

export function BlogPage() {
  const [previews, setPreviews] = useState<BlogPostPreview[]>([]);
  let navigate = useNavigate();

  useEffect(() => {
    const postsQuery = makeQuery("blog/posts");
    GET(postsQuery).then((queryResult) => {
      setPreviews(queryResult);
    });
  }, []);

  return (
    <div className="font-iowa flex flex-col items-center gap-4 px-6 py-10 md:px-10">
      <div className="font-sanchez text-3xl">Blog</div>
      {previews.length === 0 ? (
        <Loader>Loading posts...</Loader>
      ) : (
        <table className="max-w-[1000px] table-auto border-collapse">
          <tbody className="w-full">
            {previews.map((preview) => (
              <tr
                key={preview.slug}
                className="group cursor-pointer align-top"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/blog/${preview.slug}`);
                }}
                title={
                  preview.reading_time
                    ? `${preview.reading_time} min read`
                    : undefined
                }
              >
                <td className="py-1.5 pr-6 text-balance decoration-blue-500/60 underline-offset-4 group-hover:underline">
                  {preview.title}
                </td>
                <td className="py-1.5 text-right whitespace-nowrap text-black/50">
                  {formatDate(new Date(preview.date).toISOString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
