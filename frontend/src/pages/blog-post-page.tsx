import { WarningCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";
import { BlogPost } from "./blog-page";

export function BlogPostPage() {
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
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

          <div className="md:text-md shadow-inner-lg flex flex-col items-center gap-3 rounded bg-blue-500/70 px-10 py-5 text-lg font-bold text-white">
            <WarningCircle size={32} weight="bold" />
            <div>Down for maintenance, come back in a few days!</div>
          </div>

          <div className="md:text-md flex flex-col gap-2 px-10 py-4 text-justify text-lg leading-relaxed">
            {currentPost.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <button
            className="rounded-md px-2 py-1 text-lg text-black transition-all hover:bg-black/5"
            onClick={() => navigate("/blog")}
          >
            Back to posts
          </button>
        </div>
      )}
    </div>
  );
}
