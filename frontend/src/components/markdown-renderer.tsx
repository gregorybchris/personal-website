import { LinkIcon } from "@phosphor-icons/react";
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
import { CollapsibleSection } from "./collapsible-section";

SyntaxHighlighter.registerLanguage("python", python);

function createHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface HeadingWithAnchorProps {
  level: number;
  children: React.ReactNode;
}

function HeadingWithAnchor({
  level,
  children,
  ...props
}: HeadingWithAnchorProps) {
  const text = String(children);
  const id = createHeadingId(text);
  const link = `${window.location.origin}${window.location.pathname}#${id}`;

  const heading = (
    <>
      <a
        href={`#${id}`}
        className="absolute top-1/2 -left-6 -translate-y-1/2 p-1 opacity-0 transition-all duration-200 group-hover:opacity-100"
        aria-label={`Link to ${text}`}
        onClick={async () => {
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
    </>
  );

  const commonProps = { id, className: "group relative", ...props };

  switch (level) {
    case 1:
      return <h1 {...commonProps}>{heading}</h1>;
    case 2:
      return <h2 {...commonProps}>{heading}</h2>;
    case 3:
      return <h3 {...commonProps}>{heading}</h3>;
    default:
      return <h2 {...commonProps}>{heading}</h2>;
  }
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
        code({
          inline,
          className = "",
          children,
          ...props
        }: {
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
        }) {
          const match = /language-(\w+)/.exec(className);
          return !inline && match ? (
            <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        details({ children, ...props }: { children?: React.ReactNode }) {
          // Extract summary and content from children
          const childArray = Array.isArray(children) ? children : [children];
          let summary = "Show details";
          const content: React.ReactNode[] = [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          childArray.forEach((child: any) => {
            if (child?.type === "summary") {
              summary = child.props.children;
            } else if (child) {
              content.push(child);
            }
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const defaultOpen = (props as any).open !== undefined;

          return (
            <CollapsibleSection summary={summary} defaultOpen={defaultOpen}>
              {content}
            </CollapsibleSection>
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
