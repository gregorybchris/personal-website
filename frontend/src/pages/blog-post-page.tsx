import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../components/icon-button";
import { MarkdownRenderer } from "../components/markdown-renderer";
import ShareButton from "../components/share-button";
import "../styles/blog.css";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";
import { BlogPost } from "./blog-page";

export function BlogPostPage() {
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = makeQuery(`blog/posts/${slug}`);
    GET(query).then((responseJson) => {
      setCurrentPost(responseJson);
    });
  }, []);

  return (
    <div
      id="blog"
      className="font-iowa flex flex-col items-center px-7 py-6 md:px-10 md:py-10"
    >
      {currentPost === null ? (
        <span className="">Loading post...</span>
      ) : (
        <div className="flex w-full flex-col items-center gap-6 px-0 pb-4">
          <div className="flex flex-col items-center gap-2 md:max-w-[700px]">
            <div className="text-center text-2xl font-bold text-balance md:max-w-[500px] md:text-3xl">
              {currentPost.title}
            </div>
            <div className="text-sm text-black/50">
              {formatDate(new Date(currentPost.date).toISOString())}
            </div>
          </div>

          <div className="w-[100%] text-justify leading-relaxed md:w-[50%]">
            <MarkdownRenderer>{currentPost.content}</MarkdownRenderer>
          </div>

          <div className="flex flex-row items-center gap-4 py-2">
            <IconButton onClick={() => navigate("/blog")}>
              <ArrowLeftIcon size={20} weight="duotone" color="#6283c0" />
              <span className="text-md">Back to posts</span>
            </IconButton>

            {/* NOTE: Using pathname instead of href to exclude hash fragment and/or query params */}
            <ShareButton text="Share post" url={window.location.pathname} />
          </div>
        </div>
      )}
    </div>
  );
}
