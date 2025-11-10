import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import InfoImage from "../../src/assets/images/info.svg";
import { IconButton } from "../components/icon-button";
import { Loader } from "../components/loader";
import { MarkdownRenderer } from "../components/markdown-renderer";
import { BlogPostingSchema } from "../components/schema-org";
import ShareButton from "../components/share-button";
import { useMetaTags } from "../hooks/use-meta-tags";
import "../styles/blog.css";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  readingTime: number | null;
  content: string;
}

export function BlogPostPage() {
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = makeQuery(`blog/posts/${slug}`);
    GET<BlogPost>(query)
      .then((post) => {
        setCurrentPost(post);
      })
      .catch((error) => {
        console.error("Error loading blog post:", error);
        navigate("/blog");
      });
  }, [slug, navigate]);

  useMetaTags({
    title: currentPost?.title,
    url: window.location.href,
  });

  useEffect(() => {
    const DELAY = 2000;
    document.querySelectorAll(".delayed-loop").forEach((element) => {
      const video = element as HTMLVideoElement;

      // Ensure video can play inline on mobile
      video.playsInline = true;

      const handleEnded = () => {
        setTimeout(() => {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Intentionally left empty to handle the error and allow play to continue on mobile
            });
          }
        }, DELAY);
      };

      video.addEventListener("ended", handleEnded);
    });
  }, [currentPost]);

  return (
    <div className="font-iowa flex flex-col items-center px-7 py-6 md:px-10 md:py-10">
      {currentPost !== null && (
        <BlogPostingSchema
          title={currentPost.title}
          datePublished={currentPost.date}
          url={window.location.href}
        />
      )}
      {currentPost === null ? (
        <Loader text="Loading post" />
      ) : (
        <div
          id="blog"
          className="flex w-full flex-col items-center gap-6 px-0 pb-4"
        >
          <div className="flex flex-col items-center gap-2 md:max-w-[700px]">
            <div className="text-center text-2xl font-bold text-balance md:max-w-[500px] md:text-3xl">
              {currentPost.title}
            </div>
            <div className="text-sm text-black/50">
              {formatDate(new Date(currentPost.date).toISOString())}
            </div>
            {currentPost.readingTime !== null && (
              <div
                className="text-sm"
                title="Estimated using Brysbaert, M. (2019)"
              >
                <span className="text-black/25">
                  [
                  <span className="text-black/50">
                    {currentPost.readingTime} min read
                  </span>
                  ]
                </span>
              </div>
            )}
          </div>

          {/* <img src={InfoImage} alt="Information" className="code-svg w-full" /> */}

          <div className="w-[100%] text-justify leading-relaxed md:w-[50%] md:min-w-[550px]">
            <MarkdownRenderer>{currentPost.content}</MarkdownRenderer>
          </div>

          <div className="flex flex-row items-center gap-4 py-2">
            <IconButton onClick={() => navigate("/blog")}>
              <ArrowLeftIcon size={20} weight="duotone" color="#6283c0" />
              <span className="text-md">Back to posts</span>
            </IconButton>

            {/* NOTE: Using pathname instead of href to exclude hash fragment and/or query params */}
            <ShareButton
              text="Share post"
              url={window.location.pathname}
              shareTitle={currentPost.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
