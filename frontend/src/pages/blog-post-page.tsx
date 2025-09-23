import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    const query = makeQuery(`blog/posts/${slug}`);
    GET(query).then((responseJson) => {
      setCurrentPost(responseJson);
    });
  }, []);

  return (
    <div
      id="blog"
      className="flex flex-col items-center px-7 py-6 font-iowa md:px-10 md:py-10"
    >
      {currentPost === null ? (
        <span className="">Loading post...</span>
      ) : (
        <div className="flex w-full flex-col items-center gap-6 px-0">
          <div className="flex flex-col items-center gap-2 md:max-w-[700px]">
            <div className="text-balance text-center text-2xl font-bold md:max-w-[500px] md:text-3xl">
              {currentPost.title}
            </div>
            <div className="text-sm text-black/50">
              {formatDate(new Date(currentPost.date).toISOString())}
            </div>
          </div>

          <div className="w-[100%] pb-6 text-justify leading-relaxed md:w-[50%]">
            <MarkdownRenderer>{currentPost.content}</MarkdownRenderer>
          </div>

          <ShareButton url={window.location.href.replace(/\n/g, "")} />
        </div>
      )}
    </div>
  );
}
