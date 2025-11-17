import { RssIcon, SignOutIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { ErrorMessage } from "../components/error-message";
import { Loader } from "../components/loader";
import "../styles/fonts.css";
import { formatDate } from "../utilities/datetime-utilities";
import { getEnvironment } from "../utilities/environment-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

type Status = "new" | "draft" | "published";

export interface BlogPostPreview {
  title: string;
  slug: string;
  date: string;
  status: Status;
  readingTime: number | null;
}

export function BlogPage() {
  const [previews, setPreviews] = useState<BlogPostPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAdmin = searchParams.get("admin") === "true";

  useEffect(() => {
    const postsQuery = makeQuery("blog/posts");
    GET<BlogPostPreview[]>(postsQuery)
      .then((queryResult) => {
        console.log("Blog posts query result:", queryResult);
        setPreviews(queryResult);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load blog posts:", err);
        setError("Failed to load blog posts");
      });
  }, []);

  return (
    <div className="font-iowa flex flex-col items-center gap-4 px-6 py-10 md:px-10">
      <div className="font-sanchez group relative text-3xl">
        <div className="cursor-default select-none">Blog</div>
        <button
          className="bg-sky hover:bg-royal/80 active:bg-royal/50 absolute top-1/2 left-full ml-1.5 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100"
          title="Copy RSS feed link to clipboard"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const rssLink = match(getEnvironment())
              .with("development", () => "http://localhost:8000/feed.xml")
              .with("production", () => "https://rss.chrisgregory.me/feed.xml")
              .exhaustive();

            await navigator.clipboard.writeText(rssLink);
            toast.success("Copied RSS link to clipboard!", {
              duration: 2000,
              position: "top-right",
            });
          }}
        >
          <RssIcon size={16} color="white" weight="duotone" />
        </button>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : previews.length === 0 ? (
        <Loader text="Loading posts" />
      ) : (
        <table className="max-w-[1000px] table-auto border-collapse">
          <tbody className="w-full">
            {previews
              .filter((preview) => isAdmin || preview.status === "published")
              .map((preview) => (
                <tr
                  className="group cursor-pointer align-top"
                  title={
                    preview.readingTime
                      ? `${preview.readingTime} min read`
                      : undefined
                  }
                >
                  <a
                    key={preview.slug}
                    href={`/blog/${preview.slug}`}
                    className="flex w-full justify-between"
                  >
                    <td className="py-1.5 pr-6 text-balance">
                      {isAdmin && <StatusIndicator status={preview.status} />}
                      <span className="bg-gradient-to-r from-blue-500/60 to-blue-500/60 bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-[2.5px] transition-[background-size] duration-180 group-hover:bg-[length:100%_1.5px]">
                        {preview.title}
                      </span>
                    </td>
                    <td className="py-1.5 text-right whitespace-nowrap text-black/50">
                      {formatDate(new Date(preview.date).toISOString())}
                    </td>
                  </a>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {isAdmin && (
        <button
          className="mt-4 flex cursor-pointer items-center gap-2 rounded px-3 py-1 hover:bg-black/5"
          onClick={() => {
            navigate("/blog");
          }}
        >
          <SignOutIcon size={16} />
          <span>Exit admin mode</span>
        </button>
      )}
    </div>
  );
}

interface StatusIndicatorProps {
  status: Status;
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        "mr-2 inline-block h-2 w-2 rounded-full",
        status === "published" && "bg-green-400",
        status === "draft" && "bg-yellow-400",
        status === "new" && "bg-red-400",
      )}
    ></div>
  );
}
