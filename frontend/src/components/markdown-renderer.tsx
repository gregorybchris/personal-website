import { LinkIcon } from "@phosphor-icons/react";
import { JSX } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import remarkToc from "remark-toc";
import { toast } from "sonner";
import { CodeBlock } from "./code-block";

SyntaxHighlighter.registerLanguage("python", python);

function createHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function HeadingWithAnchor({
  level,
  children,
  ...props
}: {
  level: number;
  children: React.ReactNode;
}) {
  const text = String(children);
  const id = createHeadingId(text);
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const link = `${window.location.origin}${window.location.pathname}#${id}`;

  return (
    <Tag id={id} className="group relative" {...props}>
      <a
        href={`#${id}`}
        className="absolute top-1/2 -left-6 -translate-y-1/2 p-1 opacity-0 transition-all duration-200 group-hover:opacity-100"
        aria-label={`Link to ${text}`}
        onClick={async (e) => {
          await navigator.clipboard.writeText(link);
          toast.success("Copied section link to clipboard!", {
            duration: 2000,
            position: "top-right",
          });
        }}
      >
        <LinkIcon size={16} color="#555" />
      </a>
      {children}
    </Tag>
  );
}

type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkMath,
        remarkGfm,
        remarkSmartypants,
        [remarkToc, { heading: "contents|table of contents" }],
      ]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        h2({ children, ...props }) {
          return (
            <HeadingWithAnchor level={2} {...props}>
              {children}
            </HeadingWithAnchor>
          );
        },
        h3({ children, ...props }) {
          return (
            <HeadingWithAnchor level={3} {...props}>
              {children}
            </HeadingWithAnchor>
          );
        },
        code({ node, inline, className = "", children, ...props }: any) {
          const match = /language-(\w+)/.exec(className);
          return !inline && match ? (
            <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

// Other themes:
// - atomOneLight - comments are nice and distinct from code, also nice string literal colors
// - atelierDuneLight - I like the pastel colors
// - colorBrewer - very blue, which matches the site theme
// - atelierSavannaLight - muted green colors are nice
// - atelierForestLight - bright blues and oranges
// - docco - has bold that I don't like
// - googlecode - good, but dark colors don't match site theme
